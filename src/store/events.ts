import { defineStore } from 'pinia';

interface Events {
  action: string;
  message: string;
  extra?: any;
  status?: string;
  expanded?: boolean;
  date: string;
}

export const useEvents = defineStore('events', {
  state: () => ({ events: [] as Events[] }),
  getters: {
    eventList: (state) => state.events,
  },
  actions: {
    push(value: Events) {
      this.eventList.push(value)
    },
  },
})