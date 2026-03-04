// src/components/Pagination.tsx
import React from "react";
import { usePagination, DOTS } from "../hooks/usePagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    disabled,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // Jangan render komponen jika hanya ada satu halaman atau kurang
  if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
    return null;
  }

  const onNext = () => {
    if (disabled) return;
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    if (disabled) return;
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange
    ? paginationRange[paginationRange.length - 1]
    : 0;

  // ✨ Styling bertema OmzetNaik.id (Midnight Navy & Growth Red)
  const baseButtonClass =
    "flex items-center justify-center min-w-[2.75rem] h-11 px-3 text-sm font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed border-y border-r first:border-l first:rounded-l-2xl last:rounded-r-2xl";

  // Active: Midnight Navy Solid dengan shadow halus
  const activePageClass =
    "z-10 bg-[#0F1F4A] border-[#0F1F4A] text-white shadow-lg shadow-primary/20 scale-105";

  // Inactive: Putih dengan border Slate, hover ke Growth Red (Accent)
  const inactivePageClass =
    "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-[#FF3B3B] hover:border-slate-300";

  // Disabled: Background abu-abu muda pudar
  const disabledClass = "bg-slate-50 text-slate-300 border-slate-100";

  return (
    <div className="flex justify-center items-center py-16">
      <nav aria-label="Navigasi Halaman">
        <ul className="inline-flex items-center shadow-sm rounded-2xl overflow-hidden">
          {/* Tombol Previous */}
          <li>
            <button
              onClick={onPrevious}
              disabled={currentPage === 1 || disabled}
              className={`${baseButtonClass} ${
                currentPage === 1 ? disabledClass : inactivePageClass
              }`}
              aria-label="Halaman Sebelumnya"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
          </li>

          {/* Angka Halaman */}
          {paginationRange?.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <li
                  key={`dots-${index}`}
                  className="flex items-center justify-center h-11 px-3 border-y border-r border-slate-200 bg-white text-slate-400 font-bold"
                >
                  &#8230;
                </li>
              );
            }

            const isCurrent = currentPage === pageNumber;

            return (
              <li key={pageNumber}>
                <button
                  onClick={() => onPageChange(Number(pageNumber))}
                  disabled={disabled}
                  className={`${baseButtonClass} ${
                    isCurrent ? activePageClass : inactivePageClass
                  }`}
                  aria-current={isCurrent ? "page" : undefined}
                  aria-label={
                    isCurrent
                      ? `Halaman ${pageNumber}, Halaman saat ini`
                      : `Ke Halaman ${pageNumber}`
                  }
                >
                  {pageNumber}
                </button>
              </li>
            );
          })}

          {/* Tombol Next */}
          <li>
            <button
              onClick={onNext}
              disabled={currentPage === lastPage || disabled}
              className={`${baseButtonClass} ${
                currentPage === lastPage ? disabledClass : inactivePageClass
              }`}
              aria-label="Halaman Selanjutnya"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Pagination;
