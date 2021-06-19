import { watch } from 'vue';
import Axios from 'axios';
import { useUser } from 'src/store/user';

export const furiApi = Axios.create({
  baseURL: import.meta.env.VITE_API,
});

export function registerToken() {
  const { $state } = useUser();
  watch(
    () => $state.user,
    (val) => {
      furiApi.defaults.headers['access-token'] = `Bearer ${val.accessToken}`;
    },
    { immediate: true },
  );
}

export function getDDMMYY(time: number) {
  const date = new Date();

  return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
}
