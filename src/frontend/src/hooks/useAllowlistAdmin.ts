import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Principal } from '@dfinity/principal';

export function useGetAllowlist() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['allowlist'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllowlist();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddAllowlistEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAllowlistEntry(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowlist'] });
    },
  });
}

export function useRemoveAllowlistEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeAllowlistEntry(user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowlist'] });
    },
  });
}
