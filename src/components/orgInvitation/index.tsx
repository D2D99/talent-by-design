import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback, useRef } from "react";
import Pagination from "../Pagination";
import { Modal, Ripple, initTWE } from "tw-elements";
import api from "../../services/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
// Make sure this path is correct based on your project structure
import ProgressIcon from "../../../public/static/img/home/progress-icon.png";
import { Link } from "react-router-dom";

// Defined Interface
interface Invitation {
  _id: string;
  orgName?: string;
  name?: string;
  email: string;
  createdAt: string;
  totalUsers?: number;
  role: string;
  status: string;
}

const OrgInvitation = () => {
  // --- States ---
  const [dataList, setDataList] = useState<Invitation[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // New state to track which item is being deleted
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const isSuperAdmin = currentUserRole === "superadmin";

  const sortedData = [...dataList].filter((item) => {
    const matchesSearch =
      (item.orgName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter.length === 0 || statusFilter.includes(item.status);

    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const deleteModalInstance = useRef<any>(null);
  const inviteModalInstance = useRef<any>(null);

  useEffect(() => {
    initTWE({ Ripple });
  }, [dataList]);

  useEffect(() => {
    // Initialize modals
    const deleteModalEl = document.getElementById("deleteModal");
    if (deleteModalEl) {
      deleteModalInstance.current = new Modal(deleteModalEl);
    }

    const inviteModalEl = document.getElementById("inviteModal");
    if (inviteModalEl) {
      inviteModalInstance.current = new Modal(inviteModalEl);
    }

    initTWE({ Modal });

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUserRole(parsedUser.role?.toLowerCase());
      } catch (err) {
        console.error("Error parsing user data", err);
      }
    }
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Adjusted to use the 'api' instance consistent with other components
      const res = await api.get<Invitation[]>("auth/invitations");
      setDataList(res.data);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      // Only set error message if it's not a 401 (handled globally usually)
      if (error.response?.status !== 401) {
        setErrorMessage(
          error.response?.data?.message || "Failed to load data.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSendInvite = async () => {
    if (!email || !role) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("auth/send-invitation", { email, role });

      setEmail("");
      setRole("");

      // Close modal using ref
      if (inviteModalInstance.current) {
        inviteModalInstance.current.hide();
      } else {
        const modalElem = document.getElementById("inviteModal");
        const modalInstance = Modal.getInstance(modalElem);
        modalInstance?.hide();
      }

      toast.success(
        isSuperAdmin
          ? "Organization added successfully!"
          : "Invitation sent successfully!",
      );
      fetchData();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setErrorMessage(error.response?.data?.message || "Failed to send.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    setCsvFile(file);
  };

  const handleClearFile = () => {
    setCsvFile(null);
    // Reset the file input
    const fileInput = document.getElementById(
      "bulkCsvInput",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    setCsvFile(file);
  };

  const handleBulkInvite = async () => {
    if (!csvFile) {
      toast.warn("Please select a CSV file first.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", csvFile);

      const res = await api.post("auth/send-bulk-invitation", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { success, failedCount, failed } = res.data;

      if (success > 0) {
        toast.success(
          `✅ Successfully invited ${success} user${success > 1 ? "s" : ""}!${failedCount > 0 ? ` (${failedCount} failed)` : ""}`,
        );
      }

      if (failedCount > 0 && failed && failed.length > 0) {
        // Show first few failures
        const firstFailures = failed.slice(0, 3);
        firstFailures.forEach((f: any) => {
          toast.error(`${f.email}: ${f.reason}`, { autoClose: 5000 });
        });

        if (failed.length > 3) {
          toast.info(
            `...and ${failed.length - 3} more failures. Check console for details.`,
          );
          console.log("All failed invitations:", failed);
        }
      }

      handleClearFile();
      fetchData();
    } catch (err: any) {
      console.error("Bulk invite error:", err);

      // Handle different types of errors
      if (err.response) {
        // Server responded with error
        const message = err.response.data?.message || "Bulk invite failed";
        toast.error(`❌ ${message}`);

        // Log more details for debugging
        console.error("Server error details:", {
          status: err.response.status,
          data: err.response.data,
        });
      } else if (err.request) {
        // Request made but no response
        toast.error(
          "❌ No response from server. Please check your connection.",
        );
      } else {
        // Something else happened
        toast.error(`❌ Error: ${err.message || "Bulk invite failed"}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Triggered when clicking the trash icon in the table
  const openDeleteModal = (id: string, status: string) => {
    if (status !== "Expire") return;
    setSelectedId(id);

    // Open modal programmatically
    if (deleteModalInstance.current) {
      deleteModalInstance.current.show();
    } else {
      const modalElem = document.getElementById("deleteModal");
      if (modalElem) {
        const instance = new Modal(modalElem);
        instance.show();
      }
    }
  };

  // Triggered when clicking "Delete" inside the actual Modal
  const confirmDelete = async () => {
    if (!selectedId) return;

    setIsLoading(true);
    try {
      await api.delete(`auth/invitation/${selectedId}`);

      // Close the modal
      if (deleteModalInstance.current) {
        deleteModalInstance.current.hide();
      } else {
        const modalElem = document.getElementById("deleteModal");
        const modalInstance = Modal.getInstance(modalElem);
        modalInstance?.hide();
      }

      toast.success("Invitation deleted successfully.");
      fetchData();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      setErrorMessage(error.response?.data?.message || "Failed to delete.");
    } finally {
      setIsLoading(false);
      setSelectedId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border justify-center";
    switch (status) {
      case "Accept":
        return (
          <span
            className={`${base} bg-[#EEF7ED] text-[#3F9933] border-[#3F9933] dark:bg-[#163423] dark:text-[#8CDFAC] dark:border-[#2DA367]`}
          >
            Accepted
          </span>
        );
      case "Expire":
        return (
          <span
            className={`${base} bg-[#FFEEEE] text-[#D71818] border-[#D71818] dark:bg-[#411F26] dark:text-[#FF9BAA] dark:border-[#E2687A]`}
          >
            Expired
          </span>
        );
      default:
        return (
          <span
            className={`${base} bg-[#FFF8EE] text-[#E39631] border-[#E39631] dark:bg-[#43361F] dark:text-[#FFD38A] dark:border-[#E0A84D]`}
          >
            Pending
          </span>
        );
    }
  };

  return (
    <>
      <div>
        <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-162px)] dark:bg-[var(--app-surface)] dark:border-[var(--app-border-color)] dark:shadow-[0_14px_34px_rgba(0,0,0,0.26)] dark:text-[var(--app-text-color)]">
          <div className="grid">
            <div className="flex items-center md:justify-between gap-4 flex-wrap mb-8">
              <div>
                <h2 className="md:text-2xl text-xl font-bold">
                  {isSuperAdmin
                    ? "Organization Management"
                    : "Team Member Management"}
                </h2>
                <p className="text-sm text-gray-500 md:mt-1 dark:text-[var(--app-text-muted)]">
                  {isSuperAdmin
                    ? "Manage all client organizations and their admins."
                    : "Invite and manage your organization team."}
                </p>
              </div>
              <button
                type="button"
                data-twe-toggle="modal"
                data-twe-target="#inviteModal"
                className="group relative overflow-hidden z-0 text-[var(--white-color)] ps-2.5 pe-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                <Icon icon="material-symbols:add-rounded" width="22" />
                {isSuperAdmin ? "Add New Organization" : "Invite New User"}
              </button>
            </div>

            {/* Bulk Upload Section - Ultra-Compact High-End Layout */}
            <div className="mb-6 bg-white border border-gray-100 rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative overflow-hidden group">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50/40 rounded-full blur-3xl opacity-50"></div>

              <div className="flex flex-col xl:flex-row items-stretch gap-5 relative z-10">
                <div className="flex-1 lg:max-w-[340px] bg-[#f9fafc] border border-gray-100 rounded-[20px] p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20"></div>

                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100/50">
                      <Icon
                        icon="material-symbols:info-outline-rounded"
                        width="18"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1a3652] text-sm tracking-tight">
                        Setup Guide
                      </h3>
                      <p className="text-[9px] text-gray-400 font-medium">
                        Follow these requirements
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                      <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2 px-0.5">
                        Required Headers
                      </span>
                      <div className="flex gap-2">
                        <div className="flex-1 bg-blue-50/30 border border-blue-100/50 rounded-lg py-1.5 text-center">
                          <code className="text-[10px] font-mono text-blue-600 font-bold">
                            email
                          </code>
                        </div>
                        <div className="flex-1 bg-blue-50/30 border border-blue-100/50 rounded-lg py-1.5 text-center">
                          <code className="text-[10px] font-mono text-blue-600 font-bold">
                            role
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                      <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2 px-0.5">
                        Example Format
                      </span>
                      <div className="overflow-hidden rounded-lg border border-gray-50 bg-[#fcfdfe]">
                        <table className="w-full text-left text-[9px]">
                          <tbody className="divide-y divide-gray-50 text-gray-500 font-medium italic">
                            <tr>
                              <td className="px-2.5 py-1.5">
                                alex@company.com
                              </td>
                              <td className="px-2.5 py-1.5 font-bold text-gray-400">
                                {isSuperAdmin ? "admin" : "leader"}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-2.5 py-1.5">
                                sarah@company.com
                              </td>
                              <td className="px-2.5 py-1.5 font-bold text-gray-400">
                                {isSuperAdmin ? "admin" : "manager"}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-[1.1] flex flex-col justify-center">
                  <input
                    type="file"
                    accept=".csv"
                    id="bulkCsvInput"
                    hidden
                    onChange={handleFileSelect}
                  />

                  {!csvFile ? (
                    <div
                      onClick={() =>
                        document.getElementById("bulkCsvInput")?.click()
                      }
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`h-full min-h-[160px] border border-dashed rounded-[20px] flex flex-col items-center justify-center p-4 text-center transition-all duration-300 cursor-pointer group/upload ${isDragging
                          ? "border-blue-500 bg-blue-50/20 scale-[1.02]"
                          : "border-gray-100 hover:border-blue-400 hover:bg-blue-50/10"
                        }`}
                    >
                      <div className="relative mb-3 flex flex-col items-center pointer-events-none">
                        <div
                          className={`absolute inset-0 bg-blue-100/30 rounded-full blur-xl scale-125 transition-opacity ${isDragging ? "opacity-100" : "opacity-0 group-hover/upload:opacity-100"
                            }`}
                        ></div>
                        <Icon
                          icon="logos:csv"
                          width="36"
                          className={`relative z-10 drop-shadow-sm transition-transform duration-300 ${isDragging ? "scale-110" : "group-hover/upload:scale-110"
                            }`}
                        />
                      </div>

                      <h4 className="text-base font-bold text-[#1a3652] mb-0.5">
                        Add CSV file
                      </h4>
                      <p className="text-xs text-gray-400 mb-3">
                        Browse or drag and drop
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const content = isSuperAdmin
                            ? "email,role\nadmin1@company.com,admin\nadmin2@company.com,admin\nadmin3@company.com,admin"
                            : "email,role\nleader@company.com,leader\nmanager@company.com,manager\nemployee@company.com,employee";
                          const blob = new Blob([content], {
                            type: "text/csv",
                          });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = isSuperAdmin
                            ? "superadmin-template.csv"
                            : "admin-template.csv";
                          a.click();
                        }}
                        className="flex items-center gap-1 text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors bg-blue-50/50 px-2 py-1 rounded-full border border-blue-100/50 tracking-wider"
                      >
                        <Icon
                          icon="material-symbols:download-rounded"
                          width="12"
                        />
                        Get Template
                      </button>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col justify-center animate-in zoom-in-95 duration-300">
                      <div className="bg-gradient-to-br from-emerald-50 to-white rounded-[20px] border border-green-100 p-5 shadow-sm flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500 border border-green-50 mb-3">
                          <Icon icon="mdi:file-document-check" width="26" />
                        </div>

                        <div className="w-full">
                          <h4 className="text-xs font-bold text-gray-900 mb-0.5 truncate px-2">
                            {csvFile.name}
                          </h4>
                          <p className="text-[8px] text-emerald-600 font-bold uppercase tracking-widest mb-4">
                            Ready to go
                          </p>

                          <div className="flex gap-2.5 max-w-[240px] mx-auto">
                            <button
                              onClick={handleClearFile}
                              className="flex-1 py-1.5 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg text-[9px] font-black uppercase transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleBulkInvite}
                              disabled={isLoading}
                              className="flex-[1.5] py-1.5 bg-[#1a3652] text-white rounded-lg text-[9px] font-black uppercase shadow-md hover:bg-[#0f1f2e] transition-all disabled:opacity-50"
                            >
                              {isLoading ? "Wait..." : "Import"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2 text-[8px] text-gray-400 font-medium">
                <Icon
                  icon="material-symbols:verified-user-outline-rounded"
                  width="12"
                  className="text-blue-400/50"
                />
                <span className="uppercase tracking-widest">
                  Supports{" "}
                  {isSuperAdmin ? "admin" : "leader, manager, employee"} roles
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 my-6">
              <div className="relative flex-1 max-w-md">
                <Icon
                  icon="tabler:search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-[#88a7c4]"
                  width="20"
                />
                <input
                  type="text"
                  placeholder={
                    isSuperAdmin
                      ? "Search organizations, emails..."
                      : "Search members, emails..."
                  }
                  value={searchTerm}
                  autoComplete="off"
                  name="searchTerm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] transition-all border-[#E8E8E8] focus:border-[var(--primary-color)] text-gray-700 dark:bg-[var(--app-surface-muted)] dark:border-[var(--app-border-color)] dark:text-[var(--app-text-color)] dark:placeholder:text-[#88a7c4]"
                />
              </div>

              {/* <div className="relative">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm uppercase tracking-wider border transition-all md:w-auto w-full ${
                      showFilters
                        ? "bg-[var(--primary-color)] text-white"
                        : "bg-white text-blue-400 border-blue-200 hover:border-blue-300 dark:bg-[var(--app-surface)] dark:text-[#a5cdf3] dark:border-[var(--app-border-color)] dark:hover:border-[#79baf0]"
                    }`}
                  >
                    <Icon icon="hugeicons:filter" width="16" height="16" />
                    <span>Filters</span>
                    {statusFilter.length > 0 && (
                      <span
                        className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold transition-colors ml-1
                        ${showFilters ? "bg-white text-[var(--primary-color)] dark:bg-[var(--app-surface-soft)] dark:text-[#d8ebff]" : "bg-[var(--primary-color)] text-white"}`}
                      >
                        {statusFilter.length}
                      </span>
                    )}
                  </button>
                </div>

                {showFilters && (
                  <div className="w-full md:w-80 bg-white shadow-[0_0_5px_rgba(68,140,210,0.5)] md:rounded-xl py-5 z-[55] md:absolute fixed md:top-16 top-1/2 right-0 md:translate-y-0 -translate-y-1/2 md:h-auto h-full dark:bg-[var(--app-surface)] dark:border dark:border-[var(--app-border-color)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                    <div className="flex justify-between items-center mb-6 px-5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-[var(--app-heading-color)]">
                          Filters
                        </h3>
                        {statusFilter.length > 0 && (
                          <button
                            onClick={() => {
                              setStatusFilter([]);
                            }}
                            className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-tighter bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 transition-colors dark:bg-[rgba(121,186,240,0.16)] dark:border-[rgba(121,186,240,0.35)] dark:text-[#cbe4fb]"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-400 hover:text-gray-600 dark:text-[#88a7c4] dark:hover:text-[#d6e8f8]"
                      >
                        <Icon icon="material-symbols:close" width="20" />
                      </button>
                    </div>

                    <div className="px-5 space-y-6">
                      <FilterSection title="Invitation Status" open>
                        <div className="space-y-2">
                          {["Accept", "Pending", "Expire"].map((s) => (
                            <label
                              key={s}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={statusFilter.includes(s)}
                                onChange={() => {
                                  setStatusFilter((prev) =>
                                    prev.includes(s)
                                      ? prev.filter((x) => x !== s)
                                      : [...prev, s],
                                  );
                                }}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-500 dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]"
                              />
                              <span
                                className={`text-sm ${statusFilter.includes(s) ? "text-gray-800 font-medium dark:text-[#d8ebff]" : "text-gray-600 dark:text-[var(--app-text-muted)]"}`}
                              >
                                {s === "Accept"
                                  ? "Accepted"
                                  : s === "Expire"
                                    ? "Expired"
                                    : "Pending"}
                              </span>
                            </label>
                          ))}
                        </div>
                      </FilterSection>
                    </div>
                  </div>
                )}
              </div> */}
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-[var(--app-border-color)]">
              <table className="w-full whitespace-nowrap border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50/50 text-left dark:border-[var(--app-border-color)] dark:bg-[var(--app-surface-muted)]">
                    <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                      #
                    </th>
                    <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                      {isSuperAdmin ? "Organization" : "Name"}
                    </th>
                    <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                      Email
                    </th>
                    <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                      Created Date
                    </th>
                    <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                      {isSuperAdmin ? "Total Users" : "Role"}
                    </th>
                    <th className="px-6 py-4 font-semibold dark:text-[#88a7c4]">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-center dark:text-[#88a7c4]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => {
                      const canDelete = item.status === "Expire";
                      return (
                        <tr
                          key={item._id}
                          className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors dark:border-[var(--app-border-color)] dark:hover:bg-[rgba(121,186,240,0.08)]"
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-gray-700 dark:text-[var(--app-text-color)]">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="px-6 py-4 text-sm text-[var(--app-text-color)] font-bold">
                            {isSuperAdmin ? (
                              <Link
                                to={`/dashboard/organization/${item.orgName}`}
                                className="text-[#448CD2] hover:underline font-bold"
                              >
                                {item.orgName || "Unnamed Org"}
                              </Link>
                            ) : (
                              item.name || "—"
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-[var(--app-text-muted)]">
                            {item.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-[var(--app-text-muted)]">
                            {new Date(item.createdAt).toLocaleDateString(
                              "en-GB",
                            )}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            {isSuperAdmin ? (
                              <div className="flex items-center gap-2 bg-blue-50 text-[#448CD2] px-2 py-1 rounded-lg w-fit border border-blue-100">
                                <Icon
                                  icon="solar:users-group-rounded-bold"
                                  width="12"
                                />
                                <span className="font-bold">
                                  {item.totalUsers || 0}
                                </span>
                              </div>
                            ) : (
                              <span className="uppercase text-xs font-bold dark:text-[var(--app-text-color)]">
                                {item.role}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {renderStatusBadge(item.status)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              data-twe-toggle="modal"
                              data-twe-target="#deleteModal"
                              onClick={() =>
                                openDeleteModal(item._id, item.status)
                              }
                              disabled={!canDelete}
                              className={`p-2 rounded-full transition-all ${canDelete
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-gray-300 cursor-not-allowed opacity-50"
                                }`}
                            >
                              <Icon icon="si:bin-line" width="16" height="16" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-20 text-gray-400 dark:text-[#9cb8d2]"
                      >
                        {isLoading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#448CD2]"></div>
                            <span>Loading records...</span>
                          </div>
                        ) : (
                          "No invitations found."
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              totalItems={dataList.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </div>

        {/* --- Invite Modal --- */}
        <div
          data-twe-modal-init
          className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
          id="inviteModal"
          tabIndex={-1}
          aria-labelledby="inviteModalTitle"
          aria-modal="true"
          role="dialog"
          data-twe-backdrop="static"
        >
          <div
            data-twe-modal-dialog-ref
            className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
          >
            <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
              <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
                <h5
                  className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold"
                  id="inviteModalTitle"
                >
                  {isSuperAdmin ? "Add New Organization" : "Add New Member"}
                </h5>
                <button
                  type="button"
                  data-twe-modal-dismiss
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  <Icon icon="material-symbols:close" width="24" />
                </button>
              </div>

              <div className="relative sm:py-8 py-4 px-4">
                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="email"
                    className="font-bold text-[var(--secondary-color)] text-sm"
                  >
                    Email
                  </label>
                  <form autoComplete="off">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      name="modalEmail"
                      autoComplete="off"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      className="font-medium text-sm text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
                      placeholder="Enter email"
                    />
                  </form>
                </div>

                <div className="sm:mb-4 mb-2">
                  <label
                    htmlFor="role"
                    className="font-bold text-[var(--secondary-color)] text-sm"
                  >
                    Role
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 right-0 top-2 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-4 w-4 text-[#5D5D5D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    <select
                      id="role"
                      value={role}
                      autoComplete="off"
                      onChange={(e) => setRole(e.target.value)}
                      className="font-medium text-sm appearance-none text-[#5D5D5D] w-full p-3 mt-2 border rounded-lg outline-none border-[#E8E8E8] focus:border-[var(--primary-color)]"
                    >
                      <option value="">Select a role...</option>
                      {isSuperAdmin ? (
                        <option value="admin">Admin</option>
                      ) : (
                        <>
                          <option value="leader">Leader</option>
                          <option value="manager">Manager</option>
                          <option value="employee">Employee</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-neutral-200 py-4 px-4">
                <button
                  type="button"
                  data-twe-modal-dismiss
                  className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSendInvite}
                  disabled={isLoading}
                  className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
                >
                  {isLoading ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Delete Modal --- */}
        <div
          data-twe-modal-init
          className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
          id="deleteModal"
          tabIndex={-1}
          aria-labelledby="deleteModalTitle"
          aria-modal="true"
          role="dialog"
          data-twe-backdrop="static"
        >
          <div
            data-twe-modal-dialog-ref
            className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto items-center max-w-xl mx-auto"
          >
            <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-2xl border-none bg-white bg-clip-padding text-current shadow-4 outline-none">
              <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4 sm:pb-0 pb-2">
                <h5
                  className="sm:text-xl text-lg text-[var(--secondary-color)] invisible font-bold"
                  id="deleteModalTitle"
                >
                  Delete
                </h5>
                <button
                  type="button"
                  data-twe-modal-dismiss
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  <Icon icon="material-symbols:close" width="24" />
                </button>
              </div>

              <div className="relative sm:py-8 py-4 px-4 grid place-items-center gap-4">
                <img src={ProgressIcon} alt="Progress Icon" width={80} />
                <div className="text-center">
                  <h5 className="sm:text-xl text-lg text-[var(--secondary-color)] font-bold">
                    Are you sure to delete the user?
                  </h5>
                  <p className="text-sm text-neutral-600">
                    This action is permanent and the data cannot be retrieved.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-neutral-200 py-4 px-4">
                <button
                  type="button"
                  data-twe-modal-dismiss
                  className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="group relative overflow-hidden z-0 bg-red-500 px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase text-white duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-white/15 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[9999] flex items-center gap-4 animate-bounce">
            <Icon icon="solar:danger-bold" width="24" />
            <span className="font-semibold">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="ml-2 bg-white/20 rounded-full p-1"
            >
              <Icon icon="material-symbols:close" width="18" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default OrgInvitation;
