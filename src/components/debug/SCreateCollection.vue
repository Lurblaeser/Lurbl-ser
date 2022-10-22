<template>
      <TransitionRoot appear :show="isSettingsDialogOpen" as="template">
      <Dialog as="div" @close="isSettingsDialogOpen = false" class="relative z-10">
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
                  Create new collection
                </DialogTitle>
                <div class="mt-2">
                  <input type="text" v-model="collectionName" class="bg-gray-200 px-2 py-1 rounded-md" />
                </div>

                <div class="mt-4 space-x-2">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    @click="isSettingsDialogOpen = false"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    @click="createCollection"
                  >
                    Create
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
  },
  emits: ['update:open'],
  setup(props, { emit }) {
    const { open } = toRefs(props)
    const isSettingsDialogOpen = ref(open.value)
    watch(() => open.value, (newValue) => {
      isSettingsDialogOpen.value = newValue
    })

    watch(() => isSettingsDialogOpen.value, (newValue) => {
      emit('update:open', newValue)
    })

    const collectionName = ref('')

    const collections = useCollections();

    const createCollection = function() {
      collections.CreateCollection({
        info: {
          _lurblaeser_id: '123',
          name: collectionName.value,
          method: 'mqtt',
          url: {},
        }
      })

      isSettingsDialogOpen.value = false
    }

    return { isSettingsDialogOpen, createCollection, collectionName };
  }
})
</script>