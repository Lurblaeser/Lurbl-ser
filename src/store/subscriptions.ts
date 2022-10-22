import { defineStore } from 'pinia';

export interface Subscription {
  topicName: string;
  topic?: any; // Topic
}

export const useSubscriptions = defineStore('subscriptions', {
  state: () => ({ subscriptions: [] as Subscription[] }),
  getters: {
    subscriptionList: (state) => state.subscriptions,
  },
  actions: {
    push(value: Subscription) {
      this.subscriptionList.push(value)
    },
    remove(subscriptionName: string) {
      this.subscriptions =
        this.subscriptions.filter((item: Subscription) => subscriptionName !== item.topicName)
    },
    findSubscription(subscriptionName: string) {
      return this.subscriptions.filter((item: Subscription) => subscriptionName === item.topicName)[0]
    },
  },
})