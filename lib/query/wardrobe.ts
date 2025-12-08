'use client'

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import type { WardrobeItem } from '@/types/wardrobe'

export const wardrobeKeys = {
  all: ['wardrobe'] as const,
  lists: () => [...wardrobeKeys.all, 'list'] as const,
  list: (filters: { page?: number; category?: string; limit?: number }) =>
    [...wardrobeKeys.lists(), filters] as const,
  infinite: (filters: { category?: string; limit?: number }) =>
    [...wardrobeKeys.lists(), 'infinite', filters] as const,
  details: () => [...wardrobeKeys.all, 'detail'] as const,
  detail: (id: string) => [...wardrobeKeys.details(), id] as const,
}

interface WardrobeFilters {
  page?: number
  limit?: number
  category?: string
}

interface WardrobeResponse {
  items: WardrobeItem[]
  total: number
  page: number
  totalPages: number
}

// Fetch wardrobe items with pagination
async function fetchWardrobeItems(filters: WardrobeFilters = {}): Promise<WardrobeResponse> {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', filters.page.toString())
  if (filters.limit) params.set('limit', filters.limit.toString())
  if (filters.category) params.set('category', filters.category)

  const res = await fetch(`/api/wardrobe?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch wardrobe items')
  return res.json()
}

// Fetch single wardrobe item
async function fetchWardrobeItem(id: string): Promise<WardrobeItem> {
  const res = await fetch(`/api/wardrobe/${id}`)
  if (!res.ok) throw new Error('Failed to fetch wardrobe item')
  return res.json()
}

// Delete wardrobe item
async function deleteWardrobeItem(id: string): Promise<void> {
  const res = await fetch(`/api/wardrobe/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete item')
}

// Update wardrobe item
async function updateWardrobeItem(data: Partial<WardrobeItem> & { id: string }): Promise<WardrobeItem> {
  const res = await fetch(`/api/wardrobe/${data.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update item')
  return res.json()
}

// Hook to fetch wardrobe items (with pagination)
export function useWardrobe(filters: WardrobeFilters = {}) {
  return useQuery({
    queryKey: wardrobeKeys.list(filters),
    queryFn: () => fetchWardrobeItems(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook for infinite scroll wardrobe
export function useInfiniteWardrobe(filters: Omit<WardrobeFilters, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: wardrobeKeys.infinite(filters),
    queryFn: ({ pageParam = 1 }) => fetchWardrobeItems({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch single wardrobe item
export function useWardrobeItem(id: string | null) {
  return useQuery({
    queryKey: wardrobeKeys.detail(id || ''),
    queryFn: () => fetchWardrobeItem(id!),
    enabled: !!id,
  })
}

// Hook to delete wardrobe item (with optimistic update)
export function useDeleteWardrobeItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteWardrobeItem,
    onMutate: async (itemId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: wardrobeKeys.lists() })

      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: wardrobeKeys.lists() })

      // Optimistically update
      queryClient.setQueriesData<WardrobeResponse>({ queryKey: wardrobeKeys.lists() }, (old) => {
        if (!old) return old
        return {
          ...old,
          items: old.items.filter((item) => item.id !== itemId),
          total: old.total - 1,
        }
      })

      return { previousData }
    },
    onError: (_err, _itemId, context) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.lists() })
    },
  })
}

// Hook to update wardrobe item (with optimistic update)
export function useUpdateWardrobeItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateWardrobeItem,
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey: wardrobeKeys.detail(updatedItem.id) })

      const previousItem = queryClient.getQueryData(wardrobeKeys.detail(updatedItem.id))

      queryClient.setQueryData(wardrobeKeys.detail(updatedItem.id), updatedItem)

      return { previousItem }
    },
    onError: (_err, updatedItem, context) => {
      if (context?.previousItem) {
        queryClient.setQueryData(wardrobeKeys.detail(updatedItem.id), context.previousItem)
      }
    },
    onSettled: (_data, _error, updatedItem) => {
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.detail(updatedItem.id) })
      queryClient.invalidateQueries({ queryKey: wardrobeKeys.lists() })
    },
  })
}
