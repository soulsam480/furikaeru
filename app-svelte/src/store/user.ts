import { derived, writable } from 'svelte/store';
import type { UserResponse, userState } from 'main/store/user';

export const userStore = writable<Omit<userState, 'loader'>>({
  user: {},
  isLoggedin: false,
});

export function useUserStore() {
  return {
    setLogin(user: Partial<UserResponse> | null) {
      if (!user) return userStore.set({ user: {}, isLoggedin: false });
      userStore.set({ isLoggedin: true, user });
    },
    isLoggedIn: derived(userStore, ($store) => $store.isLoggedin),
    getUser: derived(userStore, ($store) => $store.user),
  };
}
