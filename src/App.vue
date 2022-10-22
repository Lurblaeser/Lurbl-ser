<script lang="ts">
import { defineComponent } from "vue";
import SFooter from "./components/SFooter.vue";
import SHeader from './components/SHeader.vue'

export default defineComponent({
  components: {
    SHeader,
    SFooter
  },
  setup() {
  }
})
</script>

<template>
  <s-header />
  <Toast />
  <router-view></router-view>
  <s-footer />
</template>

<style>
html, body {
  padding: 0;
  margin: 0;
}
</style>
