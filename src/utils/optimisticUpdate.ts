import { QueryClient } from '@tanstack/react-query';

/**
 * Helper function to perform optimistic updates with automatic rollback on error
 * @param queryClient - React Query client instance
 * @param queryKey - The query key to update
 * @param updateFn - Function that returns the updated data
 * @param context - Optional context for the update
 */
export function performOptimisticUpdate<T>(
  queryClient: QueryClient,
  queryKey: unknown[],
  updateFn: (oldData: T | undefined) => T,
  context?: unknown
) {
  // Cancel any outgoing refetches
  queryClient.cancelQueries({ queryKey });

  // Snapshot the previous value
  const previousData = queryClient.getQueryData<T>(queryKey);

  // Optimistically update to the new value
  queryClient.setQueryData<T>(queryKey, updateFn(previousData));

  // Return a context object with the snapshotted value
  return { previousData, context };
}

/**
 * Rollback function to restore previous data on error
 * @param queryClient - React Query client instance
 * @param queryKey - The query key to rollback
 * @param context - Context containing previous data
 */
export function rollbackOptimisticUpdate<T>(
  queryClient: QueryClient,
  queryKey: unknown[],
  context: { previousData?: T }
) {
  if (context.previousData) {
    queryClient.setQueryData<T>(queryKey, context.previousData);
  }
}

/**
 * Example usage for adding an item to a list:
 * 
 * const mutation = useMutation({
 *   mutationFn: addItem,
 *   onMutate: async (newItem) => {
 *     return performOptimisticUpdate(
 *       queryClient,
 *       ['items'],
 *       (old) => [...(old || []), newItem]
 *     );
 *   },
 *   onError: (err, newItem, context) => {
 *     rollbackOptimisticUpdate(queryClient, ['items'], context);
 *   },
 *   onSettled: () => {
 *     queryClient.invalidateQueries({ queryKey: ['items'] });
 *   },
 * });
 */

/**
 * Example usage for updating an item in a list:
 * 
 * const mutation = useMutation({
 *   mutationFn: updateItem,
 *   onMutate: async (updatedItem) => {
 *     return performOptimisticUpdate(
 *       queryClient,
 *       ['items'],
 *       (old) => (old || []).map(item => 
 *         item.id === updatedItem.id ? updatedItem : item
 *       )
 *     );
 *   },
 *   onError: (err, updatedItem, context) => {
 *     rollbackOptimisticUpdate(queryClient, ['items'], context);
 *   },
 *   onSettled: () => {
 *     queryClient.invalidateQueries({ queryKey: ['items'] });
 *   },
 * });
 */

/**
 * Example usage for deleting an item from a list:
 * 
 * const mutation = useMutation({
 *   mutationFn: deleteItem,
 *   onMutate: async (itemId) => {
 *     return performOptimisticUpdate(
 *       queryClient,
 *       ['items'],
 *       (old) => (old || []).filter(item => item.id !== itemId)
 *     );
 *   },
 *   onError: (err, itemId, context) => {
 *     rollbackOptimisticUpdate(queryClient, ['items'], context);
 *   },
 *   onSettled: () => {
 *     queryClient.invalidateQueries({ queryKey: ['items'] });
 *   },
 * });
 */
