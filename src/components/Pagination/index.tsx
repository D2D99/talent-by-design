// ============================================
// FILE: src/screens/OrgInvitation/Pagination.tsx
// ============================================

import React from "react";
import { Icon } from "@iconify/react";

interface PaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  onItemsPerPageChange,
}) => {
  // Logic: Hide pagination if total items are 10 or less
  if (totalItems <= 10) return null;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    onItemsPerPageChange(newValue);
    // Always reset to page 1 when changing items per page to prevent UI breaks
    onPageChange(1);
  };

  return (
    <div className="flex items-center md:justify-between w-full py-4 flex-wrap gap-3">
      {/* Left Side: Items Per Page Selector */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 top-0 flex items-center pr-3 pointer-events-none">
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
            value={itemsPerPage}
            onChange={handleSelectChange}
            className="ps-3 pe-8 py-1.5 border border-[#448CD2] border-opacity-20 rounded-md text-sm outline-none  focus:border-[var(--primary-color)] bg-white text-[#000000] font-medium cursor-pointer appearance-none w-"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            {/* <option value={100}>100</option> */}
          </select>
        </div>

        <span className="text-sm text-[#5D5D5D] font-medium">
          Show {Math.min(itemsPerPage * currentPage, totalItems)} of{" "}
          {totalItems} entries
        </span>
      </div>

      {/* Right Side: Page Navigation */}
      <div className="flex items-center gap-2 justify-end md:grow-0 grow">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Icon icon="ep:arrow-left-bold" width="12" height="12" />
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            disabled={page === "..."}
            className={`w-8 h-8 flex items-center justify-center rounded-sm text-sm font-normal transition-colors
              ${
                page === currentPage
                  ? "bg-[var(--light-primary-color)] text-[var(--primary-color)] font-semibold"
                  : page === "..."
                    ? "text-gray-400 cursor-default"
                    : "text-[#000000] hover:bg-[#edf5fd]"
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Icon icon="ep:arrow-right-bold" width="12" height="12" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
