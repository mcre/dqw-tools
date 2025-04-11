<template>
  <svg width="40" height="40" style="position: absolute; top: 10px; right: 10px">
    <defs>
      <filter id="smallBlur">
        <feGaussianBlur stdDeviation="1.0" />
      </filter>

      <radialGradient :id="`highlight-${uid}`" cx="10%" cy="10%" r="100%" fx="10%" fy="10%">
        <stop offset="0%" stop-color="white" stop-opacity="0.7" />
        <stop offset="60%" stop-color="white" stop-opacity="0" />
      </radialGradient>

      <template v-if="isCombinedColor">
        <pattern :id="`pattern-${uid}`" patternUnits="userSpaceOnUse" width="40" height="40">
          <g filter="url(#smallBlur)">
            <!-- 左上: firstColor -->
            <rect x="0" y="0" width="20" height="20" :fill="firstColor" />
            <!-- 右上: secondColor -->
            <rect x="20" y="0" width="20" height="20" :fill="secondColor" />
            <!-- 左下: secondColor -->
            <rect x="0" y="20" width="20" height="20" :fill="secondColor" />
            <!-- 右下: firstColor -->
            <rect x="20" y="20" width="20" height="20" :fill="firstColor" />
          </g>
        </pattern>
      </template>
      <template v-else>
        <radialGradient :id="`gradient-${uid}`" cx="10%" cy="10%" r="100%" fx="10%" fy="10%">
          <stop offset="0%" style="stop-color: rgb(255, 255, 255)" />
          <stop offset="100%" :style="`stop-color: ${kokorodoUtil.kokoroColorCode(colorName)}`" />
        </radialGradient>
      </template>

      <filter id="textShadow">
        <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="black" />
      </filter>
    </defs>

    <circle
      cx="20"
      cy="20"
      r="20"
      :fill="isCombinedColor ? `url(#pattern-${uid})` : `url(#gradient-${uid})`"
    />

    <circle
      v-if="isCombinedColor"
      cx="20"
      cy="20"
      r="20"
      :fill="`url(#highlight-${uid})`"
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
const props = defineProps({
  colorName: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});

const uid = getCurrentInstance()?.uid ?? "default";

const kokorodoUtil = useKokorodoUtil();

const isCombinedColor = computed(() => {
  return (
    props.colorName.length === 2 &&
    ["赤", "青", "黄", "緑", "紫"].includes(props.colorName[0]) &&
    ["赤", "青", "黄", "緑", "紫"].includes(props.colorName[1])
  );
});

const firstColor = computed(() => {
  return isCombinedColor.value ? kokorodoUtil.kokoroColorCode(props.colorName[0]) : null;
});
const secondColor = computed(() => {
  return isCombinedColor.value ? kokorodoUtil.kokoroColorCode(props.colorName[1]) : null;
});

</script>
