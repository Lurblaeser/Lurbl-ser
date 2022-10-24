<template>
  <div class="flex border-b">
    <div class="flex-1 flex items-center justify-start font-bold px-5 py-2 rounded-md">
      <Listbox v-model="selectedCollection" class="h-full min-w-[200px] group" v-slot="{open}">
        <div class="relative z-20">
          <ListboxButton
            class="relative h-full w-full cursor-default rounded-lg group-focus-within:bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 text-sm"
          >
            <span class="block truncate">{{ collections.getActiveCollection?.info.name }}</span>
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
              ref="test"
            >
              <ListboxOption
                v-slot="{ active, selected }"
                v-for="(collection, index) in collections.collections"
                :key="collection.info.name"
                :value="index"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-red-100 text-amber-900' : 'text-gray-900',
                    'relative select-none py-2 pl-10 pr-4 cursor-pointer',
                  ]"
                  @contextmenu.prevent="($refs.contextMenu as any).open($event, index)"
                >
                  <span
                    :class="[
                      selected ? 'font-medium' : 'font-normal',
                      'block truncate',
                    ]"
                    >{{ collection.info.name }}</span
                  >
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
              <hr />
              <ListboxOption v-slot="{ active,  }">
                <li
                  :class="[
                    'text-gray-900 cursor-pointer',
                    'relative cursor-default select-none my-2 py-2 mx-4 px-4',
                    'border border-red-500 rounded-md hover:bg-red-500 hover:text-white'
                  ]"
                  @click="openCreateCollectionDialog"
                >
                  <span
                    :class="[
                      'font-normal',
                      'block truncate',
                    ]"
                    >
                      Create new collection
                    </span
                  >
                </li>
              </ListboxOption>
              <ListboxOption v-slot="{ active,  }">
                <li
                  :class="[
                    'text-xs cursor-pointer text-gray-500 text-center mb-2'
                  ]"
                  @click="collections.ImportCollection()"
                >
                  <span
                    :class="[
                      'font-normal',
                      'block truncate',
                    ]"
                  >
                    Import collection
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
      <SContextMenu ref="contextMenu" :items="collectionContextItems" />
    </div>
    <div
      class="flex-none flex align-items-center justify-center font-bold px-5 py-2 rounded-md"
    >
      <div
        role="tablist"
        aria-orientation="horizontal"
        class="flex space-x-1 rounded-xl bg-blue-900/20 p-1"
      >
        <button
          class="w-full rounded-lg py-1.5 px-5 text-sm font-medium leading-5 text-white"
          :class="[
            {
              'ring-red-500 ring-opacity-60 ring-offset-2 ring-offset-white focus:outline-none focus:ring-2': !option.disabled,
              'text-black hover:bg-white/[0.12] hover:text-red-500': selectedOption !== option.code && !option.disabled,
              'text-gray-500 cursor-auto': selectedOption !== option.code && option.disabled,
              'bg-red-500 shadow': selectedOption === option.code
            }
          ]"
          id="headlessui-tabs-tab-2"
          role="tab"
          aria-selected="false"
          tabindex="-1"
          data-headlessui-state=""
          type="button"
          v-for="(option, index) in options"
          :key="index"
        >
          {{ option.name }}
        </button>
      </div>
    </div>
    <div class="flex-1 flex align-items-center justify-center font-bold px-5 py-2 rounded-md"></div>
  </div>
  <SCreateCollection v-model:open="isCreateCollectionDialogOpen" />
  <SRenameCollection v-model:open="isRenameCollectionDialogOpen" :collection-index="selectedRenameCollectionIndex" />
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue";
import { useCollections } from '../store/collections'

import SCreateCollection from '../components/debug/SCreateCollection.vue'
import SRenameCollection from '../components/debug/SRenameCollection.vue'
import SButton from "./generic/SButton.vue";
import SContextMenu, { Item } from "./generic/SContextMenu.vue";

export default defineComponent({
  name: "s-header",
  components: {
    SCreateCollection,
    SRenameCollection,
    SButton,
    SContextMenu
  },
  data() {
    return {
      selectedOption: 'debug',
      options: [
        { name: "Design", code: "design", disabled: true },
        { name: "Debug", code: "debug" },
        { name: "Test", code: "test", disabled: true },
      ],
    };
  },
  setup() {
    const collections = useCollections();

    let isCreateCollectionDialogOpen = ref(false)

    const openCreateCollectionDialog = function() {
      // REFACTOR: Investigate if there is an better way of preventing switching of collection and closing the popup when clicking the button 
      const tempMethod = collections.getActiveCollectionIndex
      isCreateCollectionDialogOpen.value = true

      // NextTick wasn't good enough
      setTimeout(() => {
        collections.activeCollectionIndex = tempMethod
      }, 1)
    }

    let isRenameCollectionDialogOpen = ref(false)
    const selectedRenameCollectionIndex = ref(null) as Ref<null | number>

    const openRenameCollectionDialog = function(index: number) {
      // REFACTOR: Investigate if there is an better way of preventing switching of collection and closing the popup when clicking the button 
      const tempMethod = collections.getActiveCollectionIndex
      isRenameCollectionDialogOpen.value = true

      selectedRenameCollectionIndex.value = index

      // NextTick wasn't good enough
      setTimeout(() => {
        collections.activeCollectionIndex = tempMethod
      }, 1)
    }

    let isImportCollectionDialogOpen = ref(false)
    const openImportCollectionDialog = function() {
      isImportCollectionDialogOpen.value = true
    }

    const selectedCollection = computed({
      get: () => collections.getActiveCollectionIndex,
      set: (val: number) => {
        collections.activeCollectionIndex = val
      }
    })

    const collectionContextItems: Item[] = [
      {
        label: 'Rename',
        event: (index: number) => {
          openRenameCollectionDialog(index);
        }
      },
      {
        label: 'Export',
        event: (index: number) => {
          collections.ExportCollection(index)
        }
      },
      {
        label: 'Delete',
        event: (index: number) => {
          collections.DeleteCollection(index)
        }
      }
    ]

    return {
      collections,
      selectedCollection,
      collectionContextItems,
      isCreateCollectionDialogOpen,
      openCreateCollectionDialog,
      isImportCollectionDialogOpen,
      openImportCollectionDialog,
      isRenameCollectionDialogOpen,
      openRenameCollectionDialog,
      selectedRenameCollectionIndex,
    }
  }
});
</script>
