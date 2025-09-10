"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { useRouter } from "next/navigation";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

const paginationLinkVariants = cva(
  "inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      isActive: {
        true: "bg-primary text-primary-foreground",
      },
    },
  }
);

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};

//! Pagination
export default function PaginationPage({
  pageNumber,
  nofPages,
  query = "",
}: {
  pageNumber: number;
  nofPages: number;
  query?: string;
}) {
  const currentPage = Math.max(Number(pageNumber) || 1, 1);
  const router = useRouter();
  const getQuery = (pageNumber: number) =>
    `?pageNumber=${pageNumber}&query=${query}`;
  return (
    <Pagination className="mt-14">
      <PaginationContent>
        {/* Previous */}
        {currentPage > 1 && (
          <PaginationItem>
            <PaginationPrevious
              onClick={() => router.push(getQuery(currentPage - 1))}
            />
          </PaginationItem>
        )}

        {/* Pages */}
        {Array.from({ length: nofPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <Link
              href={getQuery(page)}
              className={cn(
                paginationLinkVariants(),
                "bg-dark-3 hover:bg-dark-3/50",
                page === currentPage &&
                  "bg-primary-500 text-primary-light-2 hover:bg-primary-500/80"
              )}
            >
              {page}
            </Link>
          </PaginationItem>
        ))}

        {/* Next button */}
        {currentPage < nofPages && (
          <PaginationItem>
            <PaginationNext
              onClick={() => router.push(getQuery(currentPage + 1))}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
