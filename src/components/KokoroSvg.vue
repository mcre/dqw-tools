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
          :style="`stop-color: ${util.kokoroColorCode(colorName)}`"
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
      {{ cost }}
    </text>
  </svg>
</template>

<script setup lang="ts">
const util = useUtil();
defineProps({
  colorName: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});
</script>
