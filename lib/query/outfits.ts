'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const outfitKeys = {
  all: ['outfits'] as const,
  lists: () => [...outfitKeys.all, 'list'] as const,
  list: (filters: { page?: number; limit?: number }) => [...outfitKeys.lists(), filters] as const,
  details: () => [...outfitKeys.all, 'detail'] as const,
  detail: (id: string) => [...outfitKeys.details(), id] as const,
}

interface OutfitFilters {
  page?: number
  limit?: number
}

interface OutfitResponse {
  outfits: any[]
  total: number
  page: number
  totalPages: number
}

// Fetch outfit history with pagination
async function fetchOutfits(filters: OutfitFilters = {}): Promise<OutfitResponse> {
  const params = new URLSearchParams()
  if (filters.page) params.set('page', filters.page.toString())
  if (filters.limit) params.set('limit', filters.limit.toString())

  const res = await fetch(`/api/outfits/history?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch outfits')
  return res.json()
}

// Fetch single outfit
async function fetchOutfit(id: string): Promise<any> {
  const res = await fetch(`/api/outfits/${id}`)
  if (!res.ok) throw new Error('Failed to fetch outfit')
  return res.json()
}

// Like/unlike outfit
async function toggleOutfitLike(data: { id: string; liked: boolean }): Promise<any> {
  const res = await fetch(`/api/outfits/${data.id}/like`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ liked: data.liked }),
  })
  if (!res.ok) throw new Error('Failed to update outfit')
  return res.json()
}

// Hook to fetch outfits (with pagination)
export function useOutfits(filters: OutfitFilters = {}) {
  return useQuery({
    queryKey: outfitKeys.list(filters),
    queryFn: () => fetchOutfits(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Hook to fetch single outfit
export function useOutfit(id: string | null) {
  return useQuery({
    queryKey: outfitKeys.detail(id || ''),
    queryFn: () => fetchOutfit(id!),
    enabled: !!id,
  })
}

// Hook to toggle outfit like (with optimistic update)
export function useToggleOutfitLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleOutfitLike,
    onMutate: async ({ id, liked }) => {
      await queryClient.cancelQueries({ queryKey: outfitKeys.lists() })

      const previousData = queryClient.getQueriesData({ queryKey: outfitKeys.lists() })

      queryClient.setQueriesData<OutfitResponse>({ queryKey: outfitKeys.lists() }, (old) => {
        if (!old) return old
        return {
          ...old,
          outfits: old.outfits.map((outfit) =>
            outfit.id === id ? { ...outfit, liked } : outfit
          ),
        }
      })

      return { previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: outfitKeys.lists() })
    },
  })
}
