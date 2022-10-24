<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <div class="flex py-2 px-3 border-b">
      <div class="flex-1 flex flex-col align-items-stretch justify-stretch font-bold py-2 border-round">
        <div class="flex">
          <div class="flex w-full bg-gray-200 rounded-md border border-gray-200">
            <div class="flex flex-col items-stretch rounded-md">
              <Listbox v-model="selectedMethod" class="h-full w-[170px] group">
                <div class="relative z-10">
                  <ListboxButton
                    class="relative h-full w-full cursor-default rounded-lg group-focus-within:bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 text-sm"
                  >
                    <span class="block truncate">{{ selectedMethod.name }}</span>
                    <span
                      class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
                    >
                      <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </ListboxButton>

                  <transition
                    leave-active-class="transition duration-100 ease-in"
                    leave-from-class="opacity-100"
                    leave-to-class="opacity-0"
                  >
                    <ListboxOptions
                      class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                    >
                      <ListboxOption
                        v-slot="{ active, selected }"
                        v-for="method in socketMethods"
                        :key="method.name"
                        :value="method"
                        :disabled="method.disabled"
                        as="template"
                      >
                        <li
                          :class="[
                            active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-10 pr-4',
                            {
                              'bg-gray-50 text-gray-400/75': method.disabled,
                            },
                          ]"
                        >
                          <span
                            :class="[
                              selected ? 'font-medium' : 'font-normal',
                              'block truncate',
                            ]"
                            >{{ method.name }}</span
                          >
                          <span
                            v-if="selected"
                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"
                          >
                            <CheckIcon class="h-5 w-5" aria-hidden="true" />
                          </span>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
            <input type="text" v-model="brokerUrl" class="w-full rounded-md bg-gray-200 border-2 outline-none text-sm focus:bg-white font-normal pl-3 h-12" />
          </div>
          <div class="flex items-center">
            <SButton
              @click="isSettingsDialogOpen = true"
            >
              <CogIcon class="h-5 w-5" />
            </SButton>
            <SButton
              :disabled="isConnecting"
              style="min-width:120px;"
              @click="connectOrDisconnect()"
            >
              <div
                v-if="isConnecting"
                class="absolute left-0 top-0 h-full w-full flex items-center justify-center bg-gray-50/[0.5]"
              >
                <span class="animate-spin">
                  <ArrowPathIcon class="h-5 w-5 -scale-x-100 text-gray-800" />
                </span>
              </div>
              {{ isConnected ? isConnecting ? 'Connecting': 'Disconnect': 'Connect' }}
            </SButton>
          </div>
        </div>
      </div>
    </div>
    <div class="flex h-full w-full overflow-hidden">
      <TabGroup vertical :selectedIndex="collections.getActiveEventIndex" @change="(index: number) => {
        collections.SelectCollectionEvent(index)
      }">
        <TabList
          class="flex flex-col space-x-1 rounded-xl bg-gray-200/20 p-1 w-[220px]"
        >
          <div class="flex items-center w-full justify-between text-black">
            <span class="text-xs p-1 font-semibold">Scratch Pad</span>
            <button
              class="rounded-full hover:bg-gray-200"
              @click="createCollectionEvent"
            >
              <PlusIcon class="h-5 w-5" />
            </button>
          </div>
          <Tab
            v-for="(item, index) in collections.getActiveCollection?.events"
            as="template"
            :key="index"
            v-slot="{ selected }"
          >
            <button
              :class="[
                'px-4 py-1 text-sm font-medium leading-5 text-left text-black',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                selected
                  ? 'bg-gray-200 shadow'
                  : 'hover:bg-gray-200/[0.25]',
              ]"
            >
              {{ item.name ? item.name : item.request.path ? item.request.path : 'New event' }}
            </button>
          </Tab>
        </TabList>
        <Splitter layout="vertical" class="w-full h-full overflow-hidden">
          <SplitterPanel :size="1" class="overflow-hidden" :min-size="40">
            <Splitter class="w-full h-full overflow-hidden">
              <SplitterPanel class="flex" :size="10" :min-size="10">
                <TabPanels class="w-full h-full overflow-hidden">
                  <TabPanel
                    v-for="(item, index) in collections.getActiveCollection?.events"
                    :key="index"
                    class="w-full h-full overflow-hidden"
                  >
                    <div class="w-full border-top-1 surface-border overflow-auto px-2">
                      <div class="flex py-2">
                        <input
                          v-if="!selectedMethod.options || selectedMethod.options && !selectedMethod.options['disableEventTopic']"
                          type="text"
                          v-model="destinationPath"
                          class="w-full rounded-md bg-gray-200 border-2 outline-none text-sm focus:bg-white font-normal pl-3 mr-2"
                        />
                        <div
                          v-if="selectedMethod.options || selectedMethod.options && selectedMethod.options['disableEventTopic']"
                          class="w-full"
                        />
                        <SButton
                          class="flex-none"
                          :disabled="!isConnected || (destinationPath === '' || selectedMethod.options && !selectedMethod.options.disableEventTopic)"
                          :loading="isConnecting"
                          @click="sendData()"
                        >
                          Send
                        </SButton>
                      </div>
                      <div class="border border-gray-500/20">
                        <editor
                          v-model="getCode"
                          placeholder="Code goes here..."
                          :indent-with-tab="false"
                          :tab-size="2"
                          :extensions="extensions"
                        />
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </SplitterPanel>
              <SplitterPanel
                v-if="!selectedMethod.options || selectedMethod.options && !selectedMethod.options.disableSubscriptionTopics"
                :size="1"
                :min-size="10"
              >
                <div class="h-full overflow-hidden">
                  <div class="w-full border-top-1 surface-border h-full overflow-auto">
                    <div class="flex px-2">
                      <div class="flex-1 flex align-items-stretch justify-stretch font-bold py-2 border-round">
                        <input
                          type="text"
                          v-model="topicName"
                          placeholder="topic name"
                          class="w-full rounded-md bg-gray-200 border-2 outline-none text-sm focus:bg-white font-normal pl-3"
                        />
                      </div>
                      <div class="flex-none flex align-items-center justify-center ml-2 py-2 border-round">
                        <SButton
                          @click="addTopic(topicName)"
                        >
                          Add topic
                        </SButton>
                      </div>
                    </div>
                    <div class="flex w-full px-2 bg-stone-100 border-b border-stone-200">
                      Subscribed Topics
                    </div>
                    <div
                      v-for="(subscription) in collections.getActiveCollection?.subscriptions"
                      :key="subscription.name"
                      class="flex w-full items-center bg-gray-200/20 px-2 py-1"
                    >
                      <div class="flex-1">
                        <input type="text" v-model="subscription.name" class="px-2 py-1 rounded-md bg-gray-100 focus:ring-1 w-full" @keydown="unsubscribeTopic(subscription.name)" />
                      </div>
                      <div class="flex justify-end items-center">
                        <SButton
                          v-if="subscriptions.subscriptionList.filter((item) => item.topicName === subscription.name).length === 0"
                          @click="subscribeTopic(subscription.name)"
                          :disabled="!isConnected"
                        >
                          Subscribe
                        </SButton>
                        <SButton
                          v-else
                          @click="unsubscribeTopic(subscription.name)"
                          :disabled="!isConnected"
                        >
                          Unsubscribe
                        </SButton>
                        <button
                          class="ml-2 hover:text-red-500"
                          @click="removeTopic(subscription.name)"
                        >
                          <TrashIcon class="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div
                      v-if="collections.getActiveCollection?.subscriptions?.length === 0"
                      class="px-4 h-24 flex items-center justify-center font-bold bg-gray-200/20"
                    >
                      <span>Not subscribed to anything</span>
                    </div>
                  </div>
                </div>
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
          <SplitterPanel :size="1" class="h-full overflow-hidden">
            <div class="h-full overflow-hidden">
              <div class="w-full border-top-1 surface-border h-full overflow-auto">
                <div class="divide-y divide-gray-500/20 border border-gray-500/20">
                  <div
                    v-for="(event, index) in events.eventList"
                    :key="index"
                    class="flex w-full divide-x divide-gray-500/20"
                  >
                    <div class="h-7 w-7 flex items-center justify-center">
                      <ArrowRightIcon
                        class="h-5 w-5"
                        :class="[
                          event.action === 'sending' ? '-rotate-45': 'rotate-[135deg]'
                        ]"
                      />
                    </div>
                    <div class="w-44 px-2">
                      {{ event.date }}
                    </div>
                    <div class="flex-auto px-2">
                      {{ event.message }}
                    </div>
                    <div class="w-7 flex items-center justify-center">
                      <InformationCircleIcon class="h-5 w-5 cursor-pointer" @click="event.expanded = true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SplitterPanel>
        </Splitter>
      </TabGroup>
    </div>
    <SMethodSettingsDialog v-model:open="isSettingsDialogOpen" />
    <!--<SEventsRenameDialog v-model:open="isEventsRenameDialogOpen" />-->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from "vue";
import { useToast } from "primevue/usetoast";

import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { Socket } from '@lurblaeser/sockets';

import { useEvents } from '../store/events'
import { useCollections } from '../store/collections'
import { useSubscriptions } from "../store/subscriptions";

import SMethodSettingsDialog from '../components/debug/SMethodSettingsDialog.vue'
import { DriversInterface, Method } from "@lurblaeser/sockets/dist/types";

export default defineComponent({
  components: {
    editor: Codemirror,
    SMethodSettingsDialog,
  },
  mounted() {
  },
  data() {
    return {
      activeIndex: 0,
      items: [
        {id: 1, label: 'Lurblaeser'},
      ],
      contextMenuItems: [
        {
					label:'Edit',
					icon:'pi pi-fw pi-pencil',
        },
        {
					label:'Delete',
					icon:'pi pi-fw pi-trash',
        },
      ],
      code: '{\n  "name":"Luren",\n  "type":"JOIN"\n}',
      subscribedTopics: [] as any[],
      isSettingsDialogOpen: false,
    }
  },
  computed: {
    computedItems() {
      return [
        ...this.items,
        {
          id: 'add',
          label: 'Add',
          icon: 'pi pi-fw pi-plus',
          command: () => this.items.push({
            id: this.items[this.items.length-1].id + 1,
            label: 'Unnamed',
          })
        }
      ]
    }
  },
  watch: {
    brokerUrl(newValue) {
      this.socket.switchEndpoint(newValue)
    },
    selectedMethod(newValue) {
      this.collections.SwitchCollectionSocketMethod(newValue.code);
      this.socket = new Socket({
        method: newValue.code,
        endpoint: this.brokerUrl,
        logger: (log: any) => {
          this.events.push(log)
        }
      })
    },
    getActiveCollectionMethod(newValue) {
      this.selectedMethod = this.socketMethods.filter((method) => {
        return method.code.toLowerCase() === newValue.toLowerCase()
      })[0] || this.socketMethods[this.socketMethods.length-1]
    }
  },
  methods: {
    onItemRemove(id: any) {
      this.items = this.items.filter((item) => item.id !== id)
    },
    onItemClick(event: any, item: any, index: any) {
      if (item.disabled) {
        event.preventDefault();
        return;
      }
      if (item.command) {
        item.command({
          originalEvent: event,
          item: item
        });
      }
      if (index !== this.activeIndex) {
        this.activeIndex = index;
        this.$emit('update:activeIndex', this.activeIndex);
      }
      this.$emit('tab-change', {
        originalEvent: event,
        index: index
      });
    },
    onMenuRightClick(event: MouseEvent, item: any) {
      if (item.id !== 'add') {
        (this.$refs.menu as any).show(event);
      }
    },
    optionDisabled(option: any) {
      return option.disabled
    },
    addTopic(topic: string) {
      this.collections.CreateOrUpdateCollectionSubscription({
        name: topic
      })
      this.topicName = ''
    },
    async removeTopic(topic: string) {
      const findSubscription = this.subscriptions.findSubscription(topic)

      if (findSubscription) {
        await this.socket.unsubscribe(findSubscription)
      }
      this.subscriptions.remove(topic)
      this.collections.DeleteCollectionSubscription(topic)
    },
    async subscribeTopic(topic: string) {
      const subscribed = await this.socket.subscribe(topic, (payload: any) => {
        // Callback
      })

      this.events.push({
        action: 'sending',
        message: 'Subscribed to topic: ' + topic,
        date: new Date().toLocaleString("en-US")
      })

      this.collections.CreateOrUpdateCollectionSubscription({
        name: topic,
      })

      this.subscriptions.push({
        topicName: topic,
        topic: subscribed.subscribed
      })
    },
    unsubscribeTopic(topic: string) {
      const findSubscription = this.subscriptions.findSubscription(topic)

      if (findSubscription) {
        this.socket.unsubscribe(findSubscription)
        this.subscriptions.remove(findSubscription.topicName)
      }
    },
    connectOrDisconnect() {
      if (!this.isConnected) {
        this.socket.connect()
      } else {
        this.socket.disconnect()
        this.subscriptions.$reset()
      }
    }
  },
  setup() {
    const toast = useToast();
    const events = useEvents();
    const collections = useCollections();
    const subscriptions = useSubscriptions();

    const showSuccess = () => {
      toast.add({severity:'success', summary: 'Success Message', detail:'Message Content', life: 3000});
    };

    const createCollectionEvent = () => {
      collections.CreateCollectionEvent({
        name: null,
        request: {
          path: '',
          body: {
            mode: 'raw'
          }
        }
      })

      collections.activeCollectionEventIndex = (collections.getActiveCollection?.events?.length || 0 )-1
    };

    const socketMethods: Method[] = [
      { name: 'WebSocket', code: 'websocket', disabled: true },
      { name: 'MQTT', code: 'mqtt' },
      { name: 'SSE', code: 'sse', disabled: true },
      { name: 'SignalR', code: 'signalr', disabled: true },
      { name: 'SockJS', code: 'sockjs', options: {
        disableEventTopic: true,
        disableSubscriptionTopics: true,
      } },
      { name: 'Socket.io', code: 'socketio' },
      { name: 'Stomp', code: 'stomp' },
      { name: 'Stomp + SockJS', code: 'stomp-sockjs' },
    ];

    const selectedMethod = ref(socketMethods.filter((method) => {
      return method.code.toLowerCase() === collections.getActiveCollection?.info.method.toLowerCase()
    })[0] || socketMethods[socketMethods.length-1]);

    const extensions = [json()];

    const topicName: Ref<string> = ref('');
    // const brokerUrl: Ref<string> = ref('http://localhost:8890/ws');

    const brokerUrl = computed({
      get: () => {
        return collections.getActiveCollection?.info.url.raw || ''
      },
      set: (value) => {
        collections.collections[collections.getActiveCollectionIndex].info.url.raw = value
      }
    });

    const getActiveCollectionMethod = computed(() => {
      return collections.getActiveCollectionMethod || ''
    });

    const destinationPath = computed({
      get: () => {
        return collections.getActiveCollectionEvent?.request.path || ''
      },
      set: (value) => {
        collections.collections![collections.getActiveCollectionIndex].events![collections.getActiveEventIndex].request.path = value
      }
    });

    const getCode = computed({
      set(value: any) {
        collections.collections![collections.getActiveCollectionIndex].events![collections.getActiveEventIndex].request.body!.raw = value
      },
      get() {
        return collections.getActiveCollectionEvent?.request.body?.raw || ''
      }
    });

    const sendData = () => {
      socket.value.event(
        collections.getActiveCollectionEvent?.request.path!,
        getCode.value
      )
    };
    
    const socket = ref(new Socket({
      method: selectedMethod.value.code as keyof DriversInterface,
      endpoint: brokerUrl.value,
      logger: (log: any) => {
        events.push(log)
      }
    }));
    const isConnected = ref(socket.value.isConnected);
    const isConnecting = ref(socket.value.isConnecting);

    watch(() => socket.value.isConnected, (newValue) => {
      isConnected.value = newValue
    });
    watch(() => socket.value.isConnecting, (newValue) => {
      isConnecting.value = newValue
    });

    return {
      socketMethods,
      selectedMethod,
      extensions,
      showSuccess,
      createCollectionEvent,
      events,
      collections,
      subscriptions,
      brokerUrl,
      destinationPath,
      getActiveCollectionMethod,
      getCode,
      sendData,
      socket,
      isConnected,
      isConnecting,
      topicName
    }
  }
})
</script>
