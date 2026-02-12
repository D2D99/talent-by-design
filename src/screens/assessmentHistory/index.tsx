import { useEffect, useState } from "react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";
import SpinnerLoader from "../../components/spinnerLoader";
import { Icon } from "@iconify/react";
import { useAuth } from "../../context/useAuth";

const AssessmentHistory = () => {
    const { user } = useAuth();
    const [assessments, setAssessments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get("assessment/history");
            setAssessments(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStart = () => {
        navigate("/start-assessment");
    };

    if (loading) return <SpinnerLoader />;

    return (
        <>
            <div className="bg-white border border-[#448CD2] border-opacity-20 shadow-[4px_4px_4px_0px_#448CD21A] sm:p-6 p-4 rounded-[12px] mt-6 min-h-[calc(100vh-178px)]">
                <div className="grid">
                    <div className="flex items-center md:justify-between gap-4 flex-wrap mb-8">
                        <div>
                            <h2 className="md:text-2xl text-xl font-bold">My Assessments</h2>
                            <p className="text-gray-500 md:mt-1 font-medium">
                                View your past assessment history and status.
                            </p>
                        </div>
                        {(user?.role === "admin" || user?.role === "leader" || user?.role === "manager") && (
                            <button
                                onClick={handleStart}
                                type="button"
                                className="relative overflow-hidden z-0 text-white ps-4 pe-5 h-10 rounded-full flex justify-center items-center gap-1.5 font-semibold text-base uppercase bg-gradient-to-r from-[#1a3652] to-[#448bd2] duration-200 disabled:opacity-40 hover:before:scale-x-100 before:content-[''] before:absolute before:inset-0 before:bg-[#448cd2]/30 before:origin-bottom-left before:scale-x-0 before:transition-transform before:duration-300 before:ease-out before:-z-10 shadow-md hover:shadow-lg transition-shadow"
                            >
                                <Icon icon="solar:play-circle-linear" width="20" height="20" />
                                Start New Assessment
                            </button>
                        )}
                    </div>

                    {assessments.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#E4F0FC] mb-6 shadow-sm">
                                <Icon
                                    icon="solar:clipboard-list-linear"
                                    className="text-[#448CD2] w-10 h-10"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                No assessments found
                            </h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                You haven't taken any assessments yet. Click the button above to
                                get started.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-100">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#F8FAFC] border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Stakeholder
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {assessments.map((assessment) => (
                                        <tr
                                            key={assessment._id}
                                            className="hover:bg-[#F8FAFC] transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        icon="solar:calendar-linear"
                                                        className="text-[#448CD2]"
                                                        width="16"
                                                    />
                                                    {(assessment.submittedAt || assessment.createdAt) ? (
                                                        new Date(
                                                            assessment.submittedAt || assessment.createdAt
                                                        ).toLocaleDateString(undefined, {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })
                                                    ) : (
                                                        <span className="text-gray-400 italic">N/A</span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1 pl-6">
                                                    {(assessment.submittedAt || assessment.createdAt) ? (
                                                        new Date(
                                                            assessment.submittedAt || assessment.createdAt
                                                        ).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize font-medium">
                                                {assessment.stakeholder || (
                                                    <span className="text-gray-400 italic">--</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${assessment.isCompleted
                                                            ? "bg-green-50 text-green-700 border-green-200"
                                                            : "bg-amber-50 text-amber-700 border-amber-200"
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-1.5 h-1.5 rounded-full ${assessment.isCompleted
                                                                ? "bg-green-500"
                                                                : "bg-amber-500"
                                                            }`}
                                                    ></span>
                                                    {assessment.isCompleted ? "Completed" : "In Progress"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {!assessment.isCompleted ? (
                                                    <button
                                                        onClick={handleStart}
                                                        className="text-[#448CD2] hover:text-[#2c6aa0] inline-flex items-center gap-1 transition-colors group"
                                                    >
                                                        Resume
                                                        <Icon
                                                            icon="solar:arrow-right-linear"
                                                            width="16"
                                                            className="group-hover:translate-x-0.5 transition-transform"
                                                        />
                                                    </button>
                                                ) : (
                                                    <div className="text-gray-400 text-xs italic inline-flex items-center gap-1 cursor-not-allowed opacity-60">
                                                        <Icon icon="solar:document-text-linear" width="14" />
                                                        Report Soon
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AssessmentHistory;
