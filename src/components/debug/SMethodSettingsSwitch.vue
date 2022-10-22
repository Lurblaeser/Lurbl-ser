<template>
  <div class="flex items-center">
    <Switch
      v-model="enableStore"
      :class="enabled ? 'bg-teal-900' : 'bg-teal-700'"
      class="relative inline-flex h-5 w-10 mr-1 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
    >
      <span class="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        :class="enableStore ? 'translate-x-5' : 'translate-x-0'"
        class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
      />
    </Switch>
    {{ enableStore ? 'ON': 'OFF' }}
  </div>
</template>

<script lang="ts">
import { watch, defineComponent, ref, toRefs } from "vue";

export default defineComponent({
  props: {
    enabled: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ['update:enabled'],
  setup(props, { emit }) {
    const { enabled } = toRefs(props)
    const enableStore = ref(enabled.value)
    watch(() => enabled.value, (newValue) => {
      enableStore.value = newValue
    })

    watch(() => enableStore.value, (newValue) => {
      emit('update:enabled', newValue)
    })

    return { enableStore };
  }
})
</script>