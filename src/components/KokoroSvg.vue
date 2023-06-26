<template>
  <svg width="40" height="40" style="position: absolute; top: 10; right: 10">
    <defs>
      <radialGradient
        :id="`gradient-${getCurrentInstance()!.uid}`"
        cx="10%"
        cy="10%"
        r="100%"
        fx="10%"
        fy="10%"
      >
        <stop offset="0%" style="stop-color: rgb(255, 255, 255)" />
        <stop
          offset="100%"
          :style="`stop-color: ${util.kokoroColorCode(props.colorName)}`"
        />
      </radialGradient>
      <filter id="textShadow">
        <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="black" />
      </filter>
    </defs>

    <circle
      cx="20"
      cy="20"
      r="20"
      :fill="`url(#gradient-${getCurrentInstance()!.uid})`"
    />
    <text
      x="50%"
      y="50%"
      text-anchor="middle"
      dominant-baseline="middle"
      font-size="15"
      font-weight="bold"
      fill="white"
      filter="url(#textShadow)"
    >
      {{ props.cost }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { getCurrentInstance } from "vue";
import { useUtil } from "@/composables/util";
const util = useUtil();

const props = defineProps<{
  colorName: string;
  cost: number;
}>();
</script>
