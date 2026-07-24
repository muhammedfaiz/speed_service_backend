/* eslint-disable react/prop-types */
import { ChevronLeft, ChevronRight } from "lucide-react";

const getPageList = (current, total, siblingCount) => {
  const pages = new Set([1, total, current]);
  for (let i = 1; i <= siblingCount; i++) {
    pages.add(current - i);
    pages.add(current + i);
  }
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const withEllipsis = [];
  sorted.forEach((page, idx) => {
    if (idx > 0 && page - sorted[idx - 1] > 1) withEllipsis.push("...");
    withEllipsis.push(page);
  });
  return withEllipsis;
};

const Pagination = ({ currentPage, totalPages, onPageChange, siblingCount = 1 }) => {
  if (totalPages <= 1) return null;
  const pages = getPageList(currentPage, totalPages, siblingCount);

  const baseBtn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-full text-sm font-medium transition-colors";

  return (
    <nav className="flex items-center gap-1.5">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`${baseBtn} text-fg-muted hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none`}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-fg-subtle">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${baseBtn} px-3 ${
              page === currentPage ? "bg-primary text-white shadow-soft" : "text-fg hover:bg-slate-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className={`${baseBtn} text-fg-muted hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none`}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
