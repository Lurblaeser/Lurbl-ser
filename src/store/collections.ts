import { defineStore } from 'pinia';
import { open, save, confirm } from '@tauri-apps/api/dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';

export interface CollectionInfoUrl {
  raw?: string;
  protocol?: string;
}

export interface CollectionInfo {
  _lurblaeser_id: string;
  name: string;
  method: string;
  url: CollectionInfoUrl;
}

export interface CollectionEventRequestAuth {
  type: string;
  oauth2: any; // TODO
}

export interface CollectionEventRequestHeader {
  key: string;
  value: string;
  type: string; // Define type list [text, ???...]
  enabled: string;
}

export interface CollectionEventRequestBody {
  mode: string;
  raw?: string;
}

export interface CollectionEventRequest {
  auth?: CollectionEventRequestAuth;
  header?: CollectionEventRequestHeader[];
  body?: CollectionEventRequestBody;
  path?: string;
}

export interface CollectionEvent {
  name: string | null;
  request: CollectionEventRequest;
}

export interface CollectionSubscription {
  name: string;
}

export interface Collection {
  info: CollectionInfo;
  events?: CollectionEvent[];
  subscriptions?: CollectionSubscription[];
}

export const useCollections = defineStore('collections', {
  state: () => ({
    // collections: [] as Collection[],
    collections: [] as Collection[],
    activeCollectionIndex: 0,
    activeCollectionEventIndex: 0,
  }),
  getters: {
    allCollections: (state) => state.collections,
    getActiveCollection: (state) => state.collections.length > 0 ? state.collections[state.activeCollectionIndex]: null,
    getActiveCollectionIndex: (state) => state.activeCollectionIndex,
    getActiveCollectionEvent: (state) => {
      if (state.collections.length > 0) {
        const collection = state.collections[state.activeCollectionIndex]
        if (collection.events!.length > 0) {
          const event = collection.events![state.activeCollectionEventIndex]
          return event;
        }
      }
      return null
    },
    getActiveCollectionMethod: (state) => {
      if (state.collections.length > 0) {
        const collection = state.collections[state.activeCollectionIndex]
        if (collection && collection.info) {
          return collection.info.method;
        }
      }
      return null
    },
    getActiveEventIndex: (state) => state.activeCollectionEventIndex,
  },
  actions: {
    CreateCollection(value: Collection) {
      this.collections.push(value)
    },
    DeleteCollection(collectionIndex: Number) {
      this.collections =
        this.collections.filter((_item: Collection, index: number) => collectionIndex !== index)
      this.activeCollectionIndex = 0;
      this.activeCollectionEventIndex = 0;
    },
    SelectCollection(index: number) {
      this.activeCollectionIndex = index
      this.activeCollectionEventIndex = -1
    },
    async ExportCollection(index: number) {
      const filePath = await save({
        defaultPath: 'test_collection.lurblaeser_collection.json',
        filters: [{
          name: `Lurblæser collection`, // test_collection.lurblaeser_collection.json
          extensions: ['json']
        }],
      });

      if (filePath) {
        await writeTextFile(filePath, JSON.stringify(this.collections[index]))

        await confirm(`
          Collection exported to ${filePath}
        `, 'Lurblæser collection export');
      }
    },
    async ImportCollection() {
      // Open a selection dialog for image files
      const selected = await open({
        multiple: true,
        filters: [{
          name: 'Lurblæser collection',
          extensions: ['json']
        }]
      });
      if (Array.isArray(selected)) {
        // user selected multiple files
        for (const item of selected) {
          const fileContent = await readTextFile(item)
          this.collections.push(JSON.parse(fileContent))
        }
      } else if (selected === null) {
        // user cancelled the selection
      } else {
        // user selected a single file
        const fileContent = await readTextFile(selected)
        this.collections.push(JSON.parse(fileContent))
      }
    },
    CreateCollectionEvent(value: CollectionEvent) {
      if (!this.collections[this.activeCollectionIndex].events) {
        this.collections[this.activeCollectionIndex].events = []
      }
      this.collections[this.activeCollectionIndex].events!.push(value)
    },
    DeleteCollectionEvent(collectionEventIndex: number) {
      this.collections[this.activeCollectionIndex].events =
        this.collections[this.activeCollectionIndex].events!.filter((_item: CollectionEvent, index: number) => collectionEventIndex !== index)
    },
    SelectCollectionEvent(index: number) {
      this.activeCollectionEventIndex = index
    },
    SwitchCollectionSocketMethod(method: string) {
      const collection = this.collections[this.activeCollectionIndex]
      if (collection && collection.info) {
        collection.info.method = method
      }
    },
    CreateOrUpdateCollectionSubscription(value: CollectionSubscription) {
      if (!this.collections[this.activeCollectionIndex].subscriptions) {
        this.collections[this.activeCollectionIndex].subscriptions = []
      }

      // Finding uniq subscription if it exists
      const index = this.collections[this.activeCollectionIndex].subscriptions?.findIndex((subscription) => {
        return subscription.name === value.name
      })

      if (typeof index !== 'undefined' && index >= 0) {
        console.log('update!', value)
        // If exists, override/update existing
        this.collections[this.activeCollectionIndex].subscriptions![index] = value
      } else {
        console.log('new!', value)
        // If not exists, create new
        this.collections[this.activeCollectionIndex].subscriptions!.push(value)
      }
    },
    DeleteCollectionSubscription(collectionSubscriptionName: string) {
      this.collections[this.activeCollectionIndex].subscriptions =
        this.collections[this.activeCollectionIndex].subscriptions!.filter((item: CollectionSubscription) => collectionSubscriptionName !== item.name)
    },
  },
  persist: true,
})