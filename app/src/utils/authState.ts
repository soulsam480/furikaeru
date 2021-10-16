import axios from 'axios';
import { UserResponse, useUser } from 'src/store/user';
import { v4 } from 'uuid';
import { ref } from 'vue';
import { Router, useRouter } from 'vue-router';
import { furiApi, getToken, setToken } from './helpers';

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

export function tokenWatcher(router: Router) {
  const interval = setInterval(async () => {
    localStorage.removeItem('__watcher');

    if (!!getToken()) {
      try {
        await getTokens();
      } catch (error) {
        console.log(error);

        useUser().setLogin(null);
        setToken(null);
        router.push('/');
      }
    } else {
      intervalRef() && clearInterval(intervalRef() as number);
    }
  }, 846000);

  intervalRef('set', interval);
}

export function refreshUser() {
  const isAuth = ref(false);
  const { setLogin, showLoader, hideLoader } = useUser();
  const router = useRouter();

  return {
    isAuth,
    auth: async () => {
      if (!getToken()) return;

      showLoader();
      isAuth.value = true;

      try {
        await getTokens();

        const data = await getUserData();

        localStorage.setItem('__token', data.refreshToken);
        setToken(data.accessToken);
        delete (data as any).accessToken;
        delete (data as any).refreshToken;
        setLogin(data);
        setUUID();

        tokenWatcher(router);
      } catch (error) {
        console.log(error);

        setLogin(null);
        setToken(null);
        if (!!intervalRef()) clearInterval(intervalRef() as number);

        await router.push('/');
      } finally {
        isAuth.value = false;

        hideLoader();
      }
    },
  };
}
