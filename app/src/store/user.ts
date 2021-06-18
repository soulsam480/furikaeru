import { computed } from 'vue';
import { defineStore } from 'pinia';

export interface UserModel {
  id: string;
  name: string;
  email: string;
  ga_id: string;
  username: string;
  createdAt: string;
}
export interface UserResponse extends UserModel {
  accessToken: string;
  refreshToken: string;
}
interface userState {
  user: Partial<UserModel>;
  isLoggedin: boolean;
  _token: string;
}
export const useUser = defineStore({
  id: 'user',
  state: (): userState => ({ user: {}, isLoggedin: false, _token: '' }),
  actions: {
    setLogin(user: Partial<UserResponse> | null) {
      if (!user) {
        this.user = {};
        this.isLoggedin = false;
        this.setToken('');
        return;
      }
      localStorage.setItem('__token', user.refreshToken as string);
      this.setToken(user.accessToken as string);
      delete user.refreshToken;
      delete user.accessToken;
      this.user = { ...user };
      this.isLoggedin = true;
    },
    setToken(token: string) {
      this._token = token;
    },
  },
  getters: {
    isLoggedIn: (state) => computed(() => state.isLoggedin),
    getUser: (state) => computed(() => state.user),
    getToken: (state) => computed(() => state._token),
  },
});
