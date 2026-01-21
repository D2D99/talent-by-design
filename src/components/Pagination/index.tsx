// ============================================
// FILE: src/screens/orgInvitation/Pagination.tsx
// Create this new file in the same folder as index.tsx
// ============================================

import React from 'react';
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
  onItemsPerPageChange 
}) => {
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
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage);
        pages.push('...');
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
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center md:justify-between justify-center w-full py-4 flex-wrap gap-3">
      <div className="flex items-center gap-2">
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="px-3 py-1.5 border border-[#448CD2] border-opacity-20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] bg-white text-[#000000] font-medium"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span className="text-sm text-[#5D5D5D] font-medium">
          Show {Math.min(itemsPerPage, totalItems)} of {totalItems} messages
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[var(--dark-primary-color)] transition-colors"
        >
          <Icon icon="ep:arrow-left-bold" width="16" height="16" />
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            disabled={page === '...'}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors
              ${page === currentPage 
                ? 'bg-[var(--primary-color)] text-white' 
                : page === '...' 
                ? 'text-gray-400 cursor-default' 
                : 'text-[#000000] hover:bg-[#edf5fd]'
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--primary-color)] text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[var(--dark-primary-color)] transition-colors"
        >
          <Icon icon="ep:arrow-right-bold" width="16" height="16" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;