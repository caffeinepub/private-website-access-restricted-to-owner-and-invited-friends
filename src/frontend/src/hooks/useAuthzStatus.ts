import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';

export type AuthzStatus = 'authorized' | 'unauthorized' | 'loading' | 'error';

export function useAuthzStatus() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery({
    queryKey: ['authzStatus', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        const role = await actor.getCallerUserRole();
        const isAdmin = await actor.isCallerAdmin();
        
        // If user has a role (admin or user), they are authorized
        if (role === 'admin' || role === 'user') {
          return { status: 'authorized' as const, isAdmin, role };
        }
        
        return { status: 'unauthorized' as const, isAdmin: false, role };
      } catch (error) {
        // If the backend traps with "Unauthorized", treat as unauthorized
        const errorMsg = error instanceof Error ? error.message : String(error);
        if (errorMsg.includes('Unauthorized') || errorMsg.includes('not authorized')) {
          return { status: 'unauthorized' as const, isAdmin: false, role: 'guest' as const };
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    status: query.data?.status || 'loading',
    isAdmin: query.data?.isAdmin || false,
    role: query.data?.role || 'guest',
    isLoading: actorFetching || query.isLoading,
    error: query.error,
  };
}
