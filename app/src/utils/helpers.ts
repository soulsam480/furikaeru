import Axios, { AxiosError } from 'axios';
import { useUser } from 'src/store/user';
import { BoardModel } from 'src/utils/types';
import { getTokens } from './authState';

const HEADER_NAME = 'access-token';

export const furiApi = Axios.create({
  baseURL: import.meta.env.VITE_API,
});

furiApi.interceptors.response.use(undefined, async (err: AxiosError) => {
  // return if not 401 or no token
  if (err.response?.status !== 401 || !getToken()) return Promise.reject(err);

  try {
    useUser().showLoader();

    //get tokens
    await getTokens();

    useUser().hideLoader();

    // recover config
    const config = err.config;
    delete (config.headers as any)[HEADER_NAME];

    // retry the call
    return furiApi.request(config);
  } catch (error) {
    Promise.reject(err);
  }
});

export const getToken = () => localStorage.getItem('__token');

export const setToken = (token: string | null) => {
  if (!token) {
    localStorage.removeItem('__token');
  }

  (furiApi.defaults.headers as Record<string, any>)[HEADER_NAME] = !!token ? `Bearer ${token}` : null;
};

export function getDDMMYY(time: number) {
  const date = new Date();

  return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
}

/**
 * To be only used inside setup().
 */
// export function useState<S>(value: S): [Readonly<Ref<S>>, (updatedState: S) => void] {
//   const state = ref(value);
//   //@ts-ignore
//   const setStateAction = (updatedState: S) => (state.value = updatedState);
//   //@ts-ignore
//   return [readonly(state), setStateAction];
// }

export function copyLink(link: string) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(link);
    return;
  }
  navigator.clipboard.writeText(link);

  function fallbackCopyTextToClipboard(text: string) {
    var textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Copy error', err);
    }
    document.body.removeChild(textArea);
  }
}

export async function shareBoard(url: string, title: string) {
  if (!navigator.share) return;
  const data: ShareData = {
    title: `View board ${title} on Furikaeru.`,
    url,
  };
  await navigator.share(data);
}

export function generateRoute(board: BoardModel) {
  return `${board.title
    .replace(/#|\/|\?|-/g, '')
    .split(' ')
    .join('_')}--${board.id}`;
}
