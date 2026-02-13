import { Icon } from "@iconify/react";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { Modal, Ripple, initTWE } from "tw-elements";
import api from "../../services/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");
  // const [csvFile, setCsvFile] = useState<File | null>(null);


  // New state to track which item is being deleted
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  useEffect(() => {
    initTWE({ Ripple, Modal });

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
      const res = await api.get<Invitation[]>("auth/invitations");
      setDataList(res.data);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      // Only show error if it's not a session expiry (401)
      if (error.response?.status !== 401) {
        const message =
          error.response?.data?.message || "Failed to load invitations.";
        if (message.includes(",")) {
          message.split(",").forEach((msg: string) => toast.error(msg.trim()));
        } else {
          toast.error(message);
        }
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
      toast.warn("Please fill all fields.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("auth/send-invitation", { email, role });

      setEmail("");
      setRole("");

      const modalElem = document.getElementById("inviteModal");
      const modalInstance = Modal.getInstance(modalElem);
      modalInstance?.hide();

      toast.success(
        isSuperAdmin
          ? "Organization added successfully!"
          : "Invitation sent successfully!",
      );
      fetchData();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response?.status !== 401) {
        const message =
          error.response?.data?.message || "Failed to send invitation.";
        if (message.includes(",")) {
          message.split(",").forEach((msg: string) => toast.error(msg.trim()));
        } else {
          toast.error(message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };


  /* 
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        toast.error("Please upload a CSV file");
        return;
      }
  
      setCsvFile(file);
    };
  
    const handleClearFile = () => {
      setCsvFile(null);
      // Reset the file input
      const fileInput = document.getElementById("bulkCsvInput") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
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
  
        const res = await api.post(
          "auth/send-bulk-invitation",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
  
        const { success, failedCount, failed } = res.data;
  
        if (success > 0) {
          toast.success(
            `✅ Successfully invited ${success} user${success > 1 ? 's' : ''}!${failedCount > 0 ? ` (${failedCount} failed)` : ''}`
          );
        }
  
        if (failedCount > 0 && failed && failed.length > 0) {
          // Show first few failures
          const firstFailures = failed.slice(0, 3);
          firstFailures.forEach((f: any) => {
            toast.error(`${f.email}: ${f.reason}`, { autoClose: 5000 });
          });
  
          if (failed.length > 3) {
            toast.info(`...and ${failed.length - 3} more failures. Check console for details.`);
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
            data: err.response.data
          });
        } else if (err.request) {
          // Request made but no response
          toast.error("❌ No response from server. Please check your connection.");
        } else {
          // Something else happened
          toast.error(`❌ Error: ${err.message || "Bulk invite failed"}`);
        }
      } finally {
        setIsLoading(false);
      }
    };
  */


  // Triggered when clicking the trash icon in the table
  const openDeleteModal = (id: string, status: string) => {
    if (status !== "Expire") return;
    setSelectedId(id);

    // The data-twe-target on the button usually handles opening,
    // but we ensure the ID is set first.
  };

  // Triggered when clicking "Delete" inside the actual Modal
  const confirmDelete = async () => {
    if (!selectedId) return;

    setIsLoading(true);
    try {
      await api.delete(`auth/invitation/${selectedId}`);

      // Close the modal
      const modalElem = document.getElementById("deleteModal");
      const modalInstance = Modal.getInstance(modalElem);
      modalInstance?.hide();

      toast.success("Invitation deleted successfully.");
      fetchData();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      if (error.response?.status !== 401) {
        toast.error(
          error.response?.data?.message || "Failed to delete invitation.",
        );
      }
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
            className={`${base} bg-[#EEF7ED] text-[#3F9933] border-[#3F9933]`}
          >
            Accepted
          </span>
        );
      case "Expire":
        return (
          <span
            className={`${base} bg-[#FFEEEE] text-[#D71818] border-[#D71818]`}
          >
            Expired
          </span>
        );
      default:
        return (
          <span
            className={`${base} bg-[#FFF8EE] text-[#E39631] border-[#E39631]`}
          >
            Pending
          </span>
        );
    }
  };

  return (
    <div>
      <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-152px)]">
        <div className="grid">
          <div className="flex items-center md:justify-between gap-4 flex-wrap mb-8">
            <div>
              <h2 className="md:text-2xl text-xl font-bold">
                {isSuperAdmin
                  ? "Organization Management"
                  : "Team Member Management"}
              </h2>
              <p className="text-sm text-gray-500 md:mt-1">
                {isSuperAdmin
                  ? "Manage all client organizations and their admins."
                  : "Invite and manage your organization team."}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                data-twe-toggle="modal"
                data-twe-target="#inviteModal"
                className="group relative overflow-hidden z-0 text-[var(--white-color)] ps-2.5 pe-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-[var(--primary-color)] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                <Icon icon="material-symbols:add-rounded" width="22" />
                {isSuperAdmin ? "Add New Organization" : "Invite New User"}
              </button>
            </div>
          </div>

          {/* Bulk Upload Section - Ultra-Compact High-End Layout */}
          {/* <div className="mb-6 bg-white border border-gray-100 rounded-[20px] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.015)] relative overflow-hidden group">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50/40 rounded-full blur-3xl opacity-50"></div>

            <div className="flex flex-col xl:flex-row items-stretch gap-5 relative z-10">
              <div className="flex-1 lg:max-w-[340px] bg-[#f9fafc] border border-gray-100 rounded-[20px] p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20"></div>

                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100/50">
                    <Icon icon="material-symbols:info-outline-rounded" width="18" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1a3652] text-sm tracking-tight">Setup Guide</h3>
                    <p className="text-[9px] text-gray-400 font-medium">Follow these requirements</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                    <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2 px-0.5">Required Headers</span>
                    <div className="flex gap-2">
                      <div className="flex-1 bg-blue-50/30 border border-blue-100/50 rounded-lg py-1.5 text-center">
                        <code className="text-[10px] font-mono text-blue-600 font-bold">email</code>
                      </div>
                      <div className="flex-1 bg-blue-50/30 border border-blue-100/50 rounded-lg py-1.5 text-center">
                        <code className="text-[10px] font-mono text-blue-600 font-bold">role</code>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
                    <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2 px-0.5">Example Format</span>
                    <div className="overflow-hidden rounded-lg border border-gray-50 bg-[#fcfdfe]">
                      <table className="w-full text-left text-[9px]">
                        <tbody className="divide-y divide-gray-50 text-gray-500 font-medium italic">
                          <tr>
                            <td className="px-2.5 py-1.5">alex@company.com</td>
                            <td className="px-2.5 py-1.5 font-bold text-gray-400">{isSuperAdmin ? "admin" : "leader"}</td>
                          </tr>
                          <tr>
                            <td className="px-2.5 py-1.5">sarah@company.com</td>
                            <td className="px-2.5 py-1.5 font-bold text-gray-400">{isSuperAdmin ? "admin" : "manager"}</td>
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
                    onClick={() => document.getElementById("bulkCsvInput")?.click()}
                    className="h-full min-h-[160px] border-2 border-dashed border-gray-100 rounded-[20px] flex flex-col items-center justify-center p-4 text-center hover:border-blue-400 hover:bg-blue-50/10 transition-all duration-300 cursor-pointer group/upload"
                  >
                    <div className="relative mb-3 flex flex-col items-center">
                      <div className="absolute inset-0 bg-blue-100/30 rounded-full blur-xl scale-125 opacity-0 group-hover/upload:opacity-100 transition-opacity"></div>
                      <Icon icon="logos:csv" width="36" className="relative z-10 drop-shadow-sm group-hover/upload:scale-110 transition-transform duration-300" />
                    </div>

                    <h4 className="text-sm font-bold text-[#1a3652] mb-0.5">Add CSV file</h4>
                    <p className="text-[10px] text-gray-400 mb-3">Browse or drag and drop</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const content = isSuperAdmin
                          ? "email,role\nadmin1@company.com,admin\nadmin2@company.com,admin\nadmin3@company.com,admin"
                          : "email,role\nleader@company.com,leader\nmanager@company.com,manager\nemployee@company.com,employee";
                        const blob = new Blob([content], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = isSuperAdmin ? 'superadmin-template.csv' : 'admin-template.csv';
                        a.click();
                      }}
                      className="flex items-center gap-1 text-[9px] font-bold text-blue-500 hover:text-blue-600 transition-colors bg-blue-50/50 px-2 py-1 rounded-full border border-blue-100/50"
                    >
                      <Icon icon="material-symbols:download-rounded" width="12" />
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
                        <h4 className="text-xs font-bold text-gray-900 mb-0.5 truncate px-2">{csvFile.name}</h4>
                        <p className="text-[8px] text-emerald-600 font-bold uppercase tracking-widest mb-4">Ready to go</p>

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
              <Icon icon="material-symbols:verified-user-outline-rounded" width="12" className="text-blue-400/50" />
              <span className="uppercase tracking-widest">
                Supports {isSuperAdmin ? "admin" : "leader, manager, employee"} roles
              </span>
            </div>
          </div> */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Icon
                icon="tabler:search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border  rounded-lg outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
              />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm uppercase tracking-wider border transition-all md:w-auto w-full ${showFilters || statusFilter.length > 0
                    ? "bg-[var(--primary-color)] text-white"
                    : "bg-white text-blue-400 border-blue-200 hover:border-blue-300"
                    }`}
                >
                  {/* <Icon icon="mi:filter" width="18" /> */}
                  <Icon icon="hugeicons:filter" width="16" height="16" />
                  <span>Filters</span>
                  {statusFilter.length > 0 && (
                    <span className="bg-white text-[var(--primary-color)] text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1">
                      {statusFilter.length}
                    </span>
                  )}
                </button>
              </div>

              {/* --- FILTER SIDEBAR --- */}
              {showFilters && (
                <div className="w-full md:w-72 bg-white shadow-[0_0_5px_rgba(68,140,210,0.5)] md:rounded-xl p-5 flex-shrink-0 z-[55] md:absolute fixed md:top-16 top-1/2 right-0 md:translate-y-0 -translate-y-1/2 md:h-auto h-full">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-gray-800">
                        Filters
                      </h3>
                      {statusFilter.length > 0 && (
                        <button
                          onClick={() => setStatusFilter([])}
                          className="text-[10px] font-bold text-blue-500 hover:text-blue-700 uppercase tracking-tighter bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 transition-colors"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Icon icon="material-symbols:close" width="20" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Status Filter Component */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Status
                      </label>
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
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-500"
                            />
                            <span
                              className={`text-sm ${statusFilter.includes(s) ? "text-gray-800 font-medium" : "text-gray-600"}`}
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
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl">
            <table className="w-full whitespace-nowrap border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-100 bg-gray-50/50 text-left">
                  <th className="px-6 py-4 font-semibold">#</th>
                  <th className="px-6 py-4 font-semibold">
                    {isSuperAdmin ? "Organization" : "Name"}
                  </th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Created Date</th>
                  <th className="px-6 py-4 font-semibold">
                    {isSuperAdmin ? "Total Users" : "Role"}
                  </th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-center">
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
                        className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-gray-700">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
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
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {item.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
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
                            <span className="text-sm text-gray-500 capitalize">
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
                      className="text-center py-20 text-gray-400"
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
          <div className="mx-3 pointer-events-auto relative flex max-w-xl w-full flex-col rounded-[24px] border-none bg-white bg-clip-padding text-current shadow-2xl outline-none overflow-hidden">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4">
              <h5 className="text-xl font-bold leading-normal text-neutral-800" id="inviteModalTitle">
                {isSuperAdmin ? "Add New Organization" : "Invite New Member"}
              </h5>
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                data-twe-modal-dismiss
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative p-6">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-2 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                  placeholder="e.g. john.doe@example.com"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-2">
                  Assigned Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="font-medium text-sm appearance-none text-[#5D5D5D] outline-none focus-within:shadow-[0_0_1px_rgba(45,93,130,0.5)] w-full p-2 mt-2 border rounded-lg transition-all border-[#E8E8E8] focus:border-[var(--primary-color)]"
                >
                  <option value="">Select a role...</option>
                  {isSuperAdmin ? (
                    <option value="admin">Organization Admin</option>
                  ) : (
                    <>
                      <option value="leader">Team Leader</option>
                      <option value="manager">Department Manager</option>
                      <option value="employee">Team Associate</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 gap-2">
              <button
                type="button"
                data-twe-modal-dismiss
                className="group text-[var(--primary-color)] px-5 py-2 h-10 rounded-full border border-[var(--primary-color)] flex justify-center items-center gap-1.5 font-semibold text-base uppercase relative overflow-hidden z-0 duration-200 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/10 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendInvite}
                disabled={isLoading}
                className="group relative overflow-hidden z-0 text-[var(--white-color)] px-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10"
              >
                {isLoading ? "Wait..." : "Send Invitation"}
              </button>
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
            className="pointer-events-none relative flex min-h-[calc(100%-1rem)] w-auto translate-y-[-50px] items-center opacity-0 transition-all duration-300 ease-in-out max-w-xl mx-auto"
          >
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4">
              <h5 className="text-xl font-bold leading-normal text-neutral-800" id="deleteModalTitle">
                Confirm Deletion
              </h5>
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                data-twe-modal-dismiss
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative p-8 flex flex-col items-center text-center">
              <Icon icon="material-symbols:warning-active-rounded" width="48" className="text-red-500 mb-4" />
              <h5 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h5>
              <p className="text-sm text-gray-500">This action is permanent and cannot be undone.</p>
            </div>

            <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 gap-2">
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
                className="px-6 py-2 h-10 rounded-full bg-red-600 text-white font-semibold text-base uppercase hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>

        {/* Toaster removed, using react-toastify */}
      </div>
    </div>
  );
};

export default OrgInvitation;
