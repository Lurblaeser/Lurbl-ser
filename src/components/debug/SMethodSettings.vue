<template>
  <div class="flex flex-col items-stretch">
    <div
      v-for="(setting, key) of settings"
      class="flex w-full hover:bg-gray-100 rounded-md p-2 items-center"
    >
      <div class="flex-auto">
        {{ setting.title }}
        <br />
        <span class="text-sm">
          {{ setting.description }}
        </span>
      </div>
      <div class="flex-1">
        <SMethodSettingsSwitch v-model:enabled="settingsStore[key]" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { watch, defineComponent, ref } from "vue";
import SMethodSettingsSwitch from './SMethodSettingsSwitch.vue'

export default defineComponent({
  components: {
    SMethodSettingsSwitch
  },
  emits: ['update:enabled'],
  setup(props, { emit }) {
    const settingsStore = ref({
      'ssl-certificate-verification': true
    })

    const settings = ref({
      'ssl-certificate-verification': {
        title: 'Enable SSL certificate verification',
        description: 'Verify SSL certificates when sending a request. Verification failures will result in the request being aborted.',
      }
    })

    return { settings, settingsStore };
  }
})
</script>