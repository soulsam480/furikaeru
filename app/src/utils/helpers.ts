import { watch } from 'vue';
// readonly, ref, Ref,
import Axios from 'axios';
import { useUser } from 'src/store/user';
import { BoardModel } from 'src/utils/types';

export const furiApi = Axios.create({
  baseURL: import.meta.env.VITE_API,
});

export function registerToken() {
  const { $state } = useUser();

  watch(
    () => $state.user,
    (val) => {
      (furiApi.defaults.headers as Record<string, any>)['access-token'] = `Bearer ${val.accessToken}`;
    },
    { immediate: true },
  );
}

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
