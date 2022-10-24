<template>
    <TransitionRoot appear :show="isDialogOpen" as="template">
    <Dialog as="div" @close="isDialogOpen = false" class="relative z-10">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex min-h-full items-center justify-center p-4 text-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900"
              >
                Rename collection
              </DialogTitle>
              <div class="mt-2">
                <input type="text" v-model="collectionName" class="bg-gray-200 px-2 py-1 rounded-md" />
              </div>
              -{{collectionIndex}}-{{collectionName}}-
              <div class="mt-4 space-x-2">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  @click="isDialogOpen = false"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                  @click="renameCollection"
                >
                  Rename
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { watch, defineComponent, ref, toRefs } from "vue";
import { useCollections } from '../../store/collections'

export default defineComponent({
props: {
  open: {
    type: Boolean,
    default: () => false,
  },
  collectionIndex: {
    type: Number,
    default: undefined as undefined | number,
  }
},
emits: ['update:open'],
setup(props, { emit }) {
  const { open, collectionIndex } = toRefs(props)
  const isDialogOpen = ref(open.value)
  watch(() => open.value, (newValue) => {
    isDialogOpen.value = newValue
  })
  
  const collections = useCollections();
  const collectionName = ref('')

  const reactiveCollectionIndex = ref(collectionIndex.value)
  if (typeof reactiveCollectionIndex.value === 'number') {
    collectionName.value = collections.collections[reactiveCollectionIndex.value].info.name
  }
  watch(() => collectionIndex.value, (newValue) => {
    reactiveCollectionIndex.value = newValue
    if (typeof newValue === 'number') {
      collectionName.value = collections.collections[newValue].info.name
    }
  })

  watch(() => isDialogOpen.value, (newValue) => {
    emit('update:open', newValue)
  })

  const renameCollection = function() {
    if (typeof reactiveCollectionIndex.value === 'number') {
      collections.collections[reactiveCollectionIndex.value].info = {
        ...collections.collections[reactiveCollectionIndex.value].info,
        name: collectionName.value
      }
    }

    isDialogOpen.value = false
  }

  return { isDialogOpen, renameCollection, collectionName };
}
})
</script>