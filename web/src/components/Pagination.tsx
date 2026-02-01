import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) {
    if (totalPages <= 1) return null;

    const buttonClass = (active: boolean, disabled: boolean) =>
        `h-8 w-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${active
            ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
            : "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
        }`;

    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
                Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    className={buttonClass(false, currentPage <= 1 || !!isLoading)}
                >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Simple logic to show window of pages around current
                        let p = i + 1;
                        if (totalPages > 5) {
                            if (currentPage > 3) p = currentPage - 2 + i;
                            if (p > totalPages) p = totalPages - 4 + i;
                        }
                        // Ensure p is valid
                        if (p < 1) p = 1;
                        if (p > totalPages) return null;

                        return (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                disabled={isLoading}
                                className={buttonClass(currentPage === p, !!isLoading)}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    className={buttonClass(false, currentPage >= totalPages || !!isLoading)}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
