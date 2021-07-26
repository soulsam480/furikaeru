import { computed, inject, onBeforeUnmount, onMounted, readonly, ref } from 'vue';
import { AlertAPI, AlertKey, FLoadingBarExpose, FLoadingKey, KeyBindingSwitches, KeyBinding } from 'src/utils/types';
import { v4 as uuid } from 'uuid';

//TODO: move this to a new folder

const alerts = ref<Alert[]>([]);

export const getAlerts = computed(() => readonly(alerts.value));

export interface Alert {
  message: string;
  icon?: string;
  id?: string;
  type: 'success' | 'danger' | 'warning';
}

export function setAlerts(alert: Alert) {
  if (alerts.value.find((el) => el.message === alert.message)) return;
  alerts.value.push({ ...alert, id: uuid() });
  setTimeout(() => {
    if (alerts.value.length > 0) {
      alerts.value.shift();
    }
  }, 5000);
}

export function removeAlert(id: string) {
  const alertIndex = alerts.value.findIndex((el) => el.id === id);
  if (alertIndex === -1) return;
  alerts.value.splice(alertIndex, 1);
}

export function useAlert() {
  return inject(AlertKey) as AlertAPI;
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
export function useKeyBindings(bindings: KeyBinding[], inSetup: boolean = true): KeyBindingSwitches {
  const systemKeys = ['Control', 'Alt', 'Shift'];
  let handlers: ((e: KeyboardEvent) => void)[] = [];

  function generateHandler(binding: KeyBinding) {
    const { key, handler: bindingHandler, modifier } = binding;

    function handler(e: KeyboardEvent) {
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
