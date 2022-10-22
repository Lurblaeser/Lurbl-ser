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
                  Method settings
                </DialogTitle>
                <div class="mt-2">
                  <TabGroup>
                    <TabList class="font-normal space-x-3 pb-1">
                      <Tab
                        v-for="(item, index) in ['Params', 'Authorization', 'Headers', 'Settings']"
                        :key="index"
                        v-slot="{ selected }"
                      >
                        <span
                          class="pb-1 text-sm text-gray-800"
                          :class="{
                            'border-b-2 border-red-500': selected
                          }"
                        >
                          {{ item }}
                        </span>
                      </Tab>
                    </TabList>
                    <TabPanels class="font-normal">
                      <TabPanel
                        v-for="(item, index) in ['Params', 'Authorization', 'Headers', 'Settings']"
                        :key="index"
                      >
                        {{index}}
                        <component :is="`SMethod${item}`" />
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </div>

                <div class="mt-4">
                  <button
                    type="button"
                    class="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    @click="isSettingsDialogOpen = false"
                  >
                    Close
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

import SMethodAuthorization from "./SMethodAuthorization.vue";
import SMethodHeaders from "./SMethodHeaders.vue";
import SMethodParams from "./SMethodParams.vue";
import SMethodSettings from "./SMethodSettings.vue";

export default defineComponent({
  components: {
    SMethodAuthorization,
    SMethodHeaders,
    SMethodParams,
    SMethodSettings
  },
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

    return { isSettingsDialogOpen };
  }
})
</script>