<template>
  <button
    :class="[
      'px-2 rounded-md bg-red-500 text-white h-10 ml-1 relative font-bold',
      {
        'opacity-25': disabled
      }
    ]"
  >
    <slot />
  </button>
</template>

<script>
  import { defineComponent } from "vue";

  export default defineComponent({
    props: {
      disabled: {
        type: Boolean,
        default: false
      }
    }
  })
</script>