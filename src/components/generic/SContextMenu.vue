<template>
  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform scale-95 opacity-0"
    enter-to-class="transform scale-100 opacity-100"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="transform scale-100 opacity-100"
    leave-to-class="transform scale-95 opacity-0"
  >
    <div
      v-if="show"
      class="absolute z-20 w-56 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      :style="{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }"
    >
      <button
        v-for="(item, index) in items"
        :class="[
          'text-gray-900 hover:bg-red-500 hover:text-white',
          'group flex w-full items-center rounded-md px-2 py-2 text-sm',
        ]"
        @click="executeEvent(item.event)"
      >
        <component
          :is="`${item.icon}Icon`"
          aria-hidden="true"
          class="mr-2 h-5 w-5 text-violet-400"
        />
        {{ item.label }}
      </button>
      <!-- <div class="px-1 py-1">
          <button
            :class="[
              'group flex w-full items-center rounded-md px-2 py-2 text-sm',
            ]"
          >
            <EditIcon
              class="mr-2 h-5 w-5 text-violet-400"
              aria-hidden="true"
            />
            Edit
          </button>
          <button
            :class="[
              'group flex w-full items-center rounded-md px-2 py-2 text-sm',
            ]"
          >
            <DuplicateIcon
              class="mr-2 h-5 w-5 text-violet-400"
              aria-hidden="true"
            />
            Duplicate
          </button>
      </div>
      <div class="px-1 py-1">
          <button
            :class="[
              'group flex w-full items-center rounded-md px-2 py-2 text-sm',
            ]"
          >
            <ArchiveIcon
              class="mr-2 h-5 w-5 text-violet-400"
              aria-hidden="true"
            />
            Archive
          </button>
          <button
            :class="[
              'group flex w-full items-center rounded-md px-2 py-2 text-sm',
            ]"
          >
            <MoveIcon
              class="mr-2 h-5 w-5 text-violet-400"
              aria-hidden="true"
            />
            Move
          </button>
      </div>

      <div class="px-1 py-1">
        <button
          :class="[
            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
          ]"
        >
          <DeleteIcon
            class="mr-2 h-5 w-5 text-violet-400"
            aria-hidden="true"
          />
          Delete
        </button>
      </div> -->
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface Item {
  label: string
  icon?: string
  event: (index: number) => void
}

export default defineComponent({
  props: {
    items: {
      type: Array as PropType<Item[]>,
      default: []
    }
  },
  data() {
    return {
      show: false,
      extra: undefined,
      position: {
        x: 0,
        y: 0
      }
    }
  },
  methods: {
    open(event: MouseEvent, extra: any) {
      this.show = true;
      this.extra = extra;
      this.position.x = event.clientX
      this.position.y = event.clientY
    },
    executeEvent(event: (index: number) => void) {
      event(this.extra!)
      this.show = false
    }
  }
})
</script>