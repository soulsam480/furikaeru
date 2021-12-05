import type { UserResponse } from 'main/store/user';
import { furiApi, getToken, setToken } from './api';
import { v4 } from 'uuid';
import axios from 'axios';
import { useUserStore } from 'src/store/user';
import { useNavigate } from 'svelte-navigator';
import type { NavigateFn } from 'svelte-navigator';
import { writable } from 'svelte/store';

type Tokens = { accessToken: string; refreshToken: string };

export async function getUserData() {
  try {
    const { data } = await furiApi.get<UserResponse>('/auth/user');
    return data;
  } catch (error) {
    throw error;
  }
}

export function setUUID() {
  const uuid = localStorage.getItem('__uuid');
  if (!uuid) {
    localStorage.setItem('__uuid', v4());
  }
}

function intervalRef(op: 'get' | 'set' = 'get', val?: number) {
  const watcher = localStorage.getItem('__watcher');
  if (op === 'get') return !!watcher ? parseInt(watcher) : null;

  localStorage.setItem('__watcher', `${val}`);
}

export async function getTokens() {
  try {
    const {
      data: { accessToken, refreshToken },
    } = await axios.get<Tokens>('/auth/token', {
      baseURL: import.meta.env.VITE_API,
      headers: {
        'refresh-token': `Bearer ${getToken()}`,
      },
    });

    setToken(accessToken);
    localStorage.setItem('__token', refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    setToken(null);

    throw new Error('failed to get token');
  }
}

export function tokenWatcher(navigateFn: NavigateFn) {
  const interval = setInterval(async () => {
    localStorage.removeItem('__watcher');

    if (!!getToken()) {
      try {
        await getTokens();
      } catch (error) {
        console.log(error);

        useUserStore().setLogin(null);
        setToken(null);
        navigateFn('/');
      }
    } else {
      intervalRef() && clearInterval(intervalRef());
    }
  }, 846000);

  intervalRef('set', interval);
}

const isAuth = writable(false);
export function refreshUser(navigate?: NavigateFn) {
  const { setLogin } = useUserStore();

  return {
    isAuth,
    auth: async () => {
      if (!getToken()) return;
      isAuth.set(true);

      try {
        await getTokens();

        const data = await getUserData();

        localStorage.setItem('__token', data.refreshToken);
        setToken(data.accessToken);

        delete (data as any).accessToken;
        delete (data as any).refreshToken;

        setLogin(data);
        setUUID();

        navigate && tokenWatcher(navigate);
        navigate('/home');
      } catch (error) {
        console.log(error);

        setLogin(null);
        setToken(null);
        if (!!intervalRef()) clearInterval(intervalRef());

        navigate && navigate('/');
      } finally {
        isAuth.set(false);
      }
    },
  };
}
