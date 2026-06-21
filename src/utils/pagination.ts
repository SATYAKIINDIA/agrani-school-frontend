export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface PaginationState {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

/**
 * Build query parameters for pagination
 */
export function buildPaginationParams(params: PaginationParams): Record<string, string> {
  const query: Record<string, string> = {};
  
  if (params.page) query.page = params.page.toString();
  if (params.limit) query.limit = params.limit.toString();
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortOrder) query.sortOrder = params.sortOrder;
  
  return query;
}

/**
 * Calculate pagination metadata
 */
export function calculatePagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrevious,
  };
}

/**
 * Get page numbers for pagination component (with ellipsis for large page counts)
 */
export function getPageNumbers(currentPage: number, totalPages: number, maxVisible = 5): (number | string)[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  
  const pages: (number | string)[] = [];
  const halfVisible = Math.floor(maxVisible / 2);
  
  // Always show first page
  pages.push(1);
  
  // Calculate start and end of middle section
  let start = Math.max(2, currentPage - halfVisible);
  let end = Math.min(totalPages - 1, currentPage + halfVisible);
  
  // Adjust if we're near the beginning
  if (currentPage <= halfVisible + 1) {
    end = Math.min(totalPages - 1, maxVisible - 1);
  }
  
  // Adjust if we're near the end
  if (currentPage >= totalPages - halfVisible) {
    start = Math.max(2, totalPages - maxVisible + 2);
  }
  
  // Add ellipsis before middle section if needed
  if (start > 2) {
    pages.push('...');
  }
  
  // Add middle section
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  // Add ellipsis after middle section if needed
  if (end < totalPages - 1) {
    pages.push('...');
  }
  
  // Always show last page
  pages.push(totalPages);
  
  return pages;
}

/**
 * Example usage with React Query:
 * 
 * const [pagination, setPagination] = useState<PaginationState>({
 *   page: DEFAULT_PAGE,
 *   limit: DEFAULT_LIMIT,
 * });
 * 
 * const { data, isLoading } = useQuery({
 *   queryKey: ['items', pagination],
 *   queryFn: () => fetchItems(buildPaginationParams(pagination)),
 * });
 * 
 * // In component:
 * <Pagination
 *   currentPage={pagination.page}
 *   totalPages={data?.pagination.totalPages || 1}
 *   onPageChange={(page) => setPagination({ ...pagination, page })}
 * />
 */
