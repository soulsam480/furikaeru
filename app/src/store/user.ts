import { computed } from 'vue';
import { defineStore } from 'pinia';

export interface UserModel {
  id: string;
  name: string;
  email: string;
  ga_id: string;
  username: string;
  createdAt: string;
  accessToken: string;
  refreshToken: string;
}
export interface UserResponse extends UserModel {
  accessToken: string;
  refreshToken: string;
}
interface userState {
  user: Partial<UserModel>;
  isLoggedin: boolean;
  loader: boolean;
}
export const useUser = defineStore({
  id: 'user',
  state: (): userState => ({ user: {}, isLoggedin: false, loader: false }),
  actions: {
    setLogin(user: Partial<UserResponse> | null) {
      if (!user) {
        this.user = {};
        this.isLoggedin = false;
        return;
      }

      this.user = { ...user };
      this.isLoggedin = true;
    },
    showLoader() {
      this.loader = true;
    },
    hideLoader() {
      this.loader = false;
    },
  },
  getters: {
    isLoggedIn: (state) => computed(() => state.isLoggedin),
    getUser: (state) => computed(() => state.user),
    getLoader: (state) => computed(() => state.loader),
  },
});
