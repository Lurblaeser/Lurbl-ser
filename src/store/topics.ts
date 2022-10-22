import { defineStore } from 'pinia';
import { Topic } from '@lurblaeser/sockets/dist/types';

export const useTopics = defineStore('topics', {
  state: () => ({ topics: [] as Topic[] }),
  getters: {
    topicList: (state) => state.topics,
  },
  actions: {
    push(value: Topic) {
      this.topicList.push(value)
    },
  },
})