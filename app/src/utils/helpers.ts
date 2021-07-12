import { inject, onBeforeUnmount, onMounted, readonly, ref, Ref, watch } from 'vue';
import Axios from 'axios';
import { useUser } from 'src/store/user';
import { BoardModel, FLoadingBarExpose, FLoadingKey, KeyBindingSwitches, KeyBinding } from './types';

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

/**
 * To be only used inside setup().
 */
export function useState<S>(value: S): [Readonly<Ref<S>>, (updatedState: S) => void] {
  const state = ref(value);
  //@ts-ignore
  const setStateAction = (updatedState: S) => (state.value = updatedState);
  //@ts-ignore
  return [readonly(state), setStateAction];
}

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
      var successful = document.execCommand('copy');
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

export function useLoadingBar() {
  return inject(FLoadingKey) as FLoadingBarExpose;
}

/**
 * use key bindings
 * @param bindings
 * @param isSetup automatically enable/disable inside setup
 * @returns an object containing on/off switches for the key bindings
 */
export function useKeyBindings(bindings: KeyBinding[], inSetup?: boolean): KeyBindingSwitches {
  const systemKeys = ['Control', 'Alt', 'Shift'];
  let handlers: ((e: KeyboardEvent) => void)[] = [];

  function generateHandler(binding: KeyBinding) {
    const { key, handler: bindingHandler, modifier } = binding;

    function handler(e: KeyboardEvent) {
      e.preventDefault();
      const { key: eventKey } = e;

      if (systemKeys.includes(eventKey)) return;

      let newModifier = '';

      if (e.ctrlKey) newModifier = 'Control';
      if (e.altKey) newModifier = 'Alt';
      if (e.shiftKey) newModifier = 'Shift';

      if (!modifier) {
        if (eventKey === key) bindingHandler();
        newModifier = '';
        return;
      }

      if (modifier === newModifier && eventKey === key) {
        console.log('Running handler for', modifier, key);
        bindingHandler();
        newModifier = '';
      }
    }

    handlers.push(handler);

    return handler;
  }

  const switches: KeyBindingSwitches = {
    on: () => {
      bindings.forEach((binding) => {
        window.addEventListener('keydown', generateHandler(binding));
      });
    },
    off: () => {
      handlers.forEach((handler) => {
        window.removeEventListener('keydown', handler);
      });
      handlers = [];
    },
  };

  if (inSetup) {
    onMounted(() => switches.on());
    onBeforeUnmount(() => switches.off());
  }

  return switches;
}
