import { defineStore } from 'pinia';

export interface UserModel {
  id: string;
  name: string;
  email: string;
  ga_id: string;
  username: string;
  createdAt: string;
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
    setLogin(user: UserModel | null) {
      if (!user) return (this.user = {}), (this.isLoggedin = false);
      this.user = { ...user };
      this.isLoggedin = true;
    },
    setToken(token: string) {
      this._token = token;
    },
  },
});
