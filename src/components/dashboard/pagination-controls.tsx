"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/server/utils";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

function getPageNumbers(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  pages.push(1);
  if (windowStart > 2) pages.push("ellipsis");
  for (let page = windowStart; page <= windowEnd; page++) pages.push(page);
  if (windowEnd < totalPages - 1) pages.push("ellipsis");
  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

export function PaginationControls({ currentPage, totalPages, basePath }: PaginationControlsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingPage, setPendingPage] = useState<number | null>(null);

  if (totalPages <= 1) return null;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  function goToPage(page: number) {
    setPendingPage(page);
    startTransition(() => {
      router.push(`${basePath}?page=${page}`);
    });
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <PageButton
        disabled={!hasPrev || isPending}
        ariaLabel="Previous page"
        onClick={() => goToPage(currentPage - 1)}
      >
        <ChevronLeft />
      </PageButton>

      {pageNumbers.map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            disabled={isPending}
            aria-current={page === currentPage ? "page" : undefined}
            onClick={() => goToPage(page)}
            className={cn(
              buttonVariants({ variant: page === currentPage ? "default" : "outline", size: "icon" }),
              "h-9 w-9",
              isPending && "opacity-50"
            )}
          >
            {isPending && pendingPage === page ? <Loader2 className="animate-spin" /> : page}
          </button>
        )
      )}

      <PageButton
        disabled={!hasNext || isPending}
        ariaLabel="Next page"
        onClick={() => goToPage(currentPage + 1)}
      >
        <ChevronRight />
      </PageButton>
    </nav>
  );
}

function PageButton({
  disabled,
  ariaLabel,
  onClick,
  children,
}: {
  disabled: boolean;
  ariaLabel: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {children}
    </button>
  );
}
