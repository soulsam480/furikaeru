import { computed } from '@vue/runtime-core';
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';

interface Alert {
  message: string;
  icon?: string;
  id?: string;
  type: 'success' | 'danger' | 'warning';
}

interface AlertState {
  alerts: Alert[];
}

export const useAlerts = defineStore({
  id: 'alerts',
  state: (): AlertState => ({
    alerts: [],
  }),
  actions: {
    setAlerts(alert: Alert) {
      if (this.alerts.find((el) => el.message === alert.message)) return;
      this.alerts.push({ ...alert, id: uuid() });
      setTimeout(() => {
        if (this.alerts.length > 0) {
          this.alerts.shift();
        }
      }, 5000);
    },
    removeAlert(id: string) {
      const alertIndex = this.alerts.findIndex((el) => el.id === id);
      if (alertIndex === -1) return;
      this.alerts.splice(alertIndex, 1);
    },
  },
  getters: {
    getAlerts: (state) => computed(() => state.alerts),
  },
});
