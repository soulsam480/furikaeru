import Axios, { AxiosError } from 'axios';
import { getTokens } from './authState';

const AUTH_HEADER = 'access-token';

export const furiApi = Axios.create({
  baseURL: import.meta.env.VITE_API,
});

export const getToken = () => localStorage.getItem('__token');

export const setToken = (token: string | null) => {
  if (!token) {
    localStorage.removeItem('__token');
  }

  (furiApi.defaults.headers as Record<string, any>)[AUTH_HEADER] = !!token ? `Bearer ${token}` : null;
};

furiApi.interceptors.response.use(undefined, async (err: AxiosError) => {
  // return if not 401 or no token
  if (err.response?.status !== 401 || !getToken()) return Promise.reject(err);

  try {
    // useUser().showLoader();

    //get tokens
    await getTokens();

    // useUser().hideLoader();

    // recover config
    const config = err.config;
    delete (config.headers as any)[AUTH_HEADER];

    // retry the call
    return furiApi.request(config);
  } catch (error) {
    Promise.reject(err);
  }
});
