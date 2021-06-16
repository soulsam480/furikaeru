import { watch } from '@vue/runtime-core';
import Axios from 'axios';
import { useUser } from 'src/store/user';

export const furiApi = Axios.create({
  baseURL: import.meta.env.VITE_API,
});

export function registerToken() {
  const { $state } = useUser();
  watch(
    () => $state._token,
    (val) => {
      furiApi.defaults.headers['Authorization'] = val;
    },
    { immediate: true },
  );
}
