<template>
  <svg width="40" height="40" style="position: absolute; top: 10px; right: 10px">
    <defs>
      <filter id="smallBlur">
        <feGaussianBlur stdDeviation="1.0" />
      </filter>
      <filter id="largeBlur">
        <feGaussianBlur stdDeviation="3.0" />
      </filter>

      <radialGradient :id="`highlight-${uid}`" cx="10%" cy="10%" r="100%" fx="10%" fy="10%">
        <stop offset="0%" stop-color="white" stop-opacity="0.7" />
        <stop offset="60%" stop-color="white" stop-opacity="0" />
      </radialGradient>

      <template v-if="isCombinedColor">
        <pattern :id="`pattern-${uid}`" patternUnits="userSpaceOnUse" width="40" height="40">
          <g :filter="patternBlurFilter">
            <template v-if="isMultiColorPattern">
              <path
                v-for="(sector, index) in sectorPaths"
                :key="index"
                :d="sector.d"
                :fill="sector.color"
              />
            </template>
            <template v-else>
              <rect
                v-for="(rect, index) in patternRects"
                :key="index"
                :x="rect.x"
                :y="rect.y"
                :width="rect.width"
                :height="rect.height"
                :fill="rect.color"
              />
            </template>
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

const baseCombinedColors = ["赤", "青", "黄", "緑", "紫"];
const specialCombinedColors: Record<string, string[]> = {
  虹: ["赤", "黄", "緑", "青", "紫"],
};

const combinedColorNames = computed(() => {
  const specialColor = specialCombinedColors[props.colorName];
  if (specialColor) {
    return specialColor;
  }
  if (
    props.colorName.length === 2 &&
    baseCombinedColors.includes(props.colorName[0]) &&
    baseCombinedColors.includes(props.colorName[1])
  ) {
    return [props.colorName[0], props.colorName[1]];
  }
  return [];
});

const isCombinedColor = computed(() => combinedColorNames.value.length > 0);
const isMultiColorPattern = computed(() => combinedColorNames.value.length > 2);
const isRainbowPattern = computed(() => props.colorName === "虹");
const patternBlurFilter = computed(() =>
  isRainbowPattern.value ? "url(#largeBlur)" : "url(#smallBlur)",
);

interface PatternRect {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const patternRects = computed<PatternRect[]>(() => {
  if (!isCombinedColor.value || isMultiColorPattern.value) {
    return [];
  }
  const colorCodes = combinedColorNames.value.map((color) =>
    kokorodoUtil.kokoroColorCode(color),
  );

  if (colorCodes.length < 2) {
    return [];
  }

  const quadrantColors = [colorCodes[0], colorCodes[1], colorCodes[1], colorCodes[0]];
  const positions = [
    { x: 0, y: 0 },
    { x: 20, y: 0 },
    { x: 0, y: 20 },
    { x: 20, y: 20 },
  ];
  return positions.map((pos, index) => ({
    ...pos,
    width: 20,
    height: 20,
    color: quadrantColors[index],
  }));
});

interface SectorPath {
  d: string;
  color: string;
}

const sectorPaths = computed<SectorPath[]>(() => {
  if (!isMultiColorPattern.value) {
    return [];
  }
  const colorCodes = combinedColorNames.value.map((color) =>
    kokorodoUtil.kokoroColorCode(color),
  );
  const center = 20;
  const radius = 20;
  const angleStep = 360 / colorCodes.length;
  const toRadians = (angle: number) => ((angle - 90) * Math.PI) / 180;

  return colorCodes.map((color, index) => {
    const startAngle = -90 + angleStep * index;
    const endAngle = startAngle + angleStep;
    const start = {
      x: center + radius * Math.cos(toRadians(startAngle)),
      y: center + radius * Math.sin(toRadians(startAngle)),
    };
    const end = {
      x: center + radius * Math.cos(toRadians(endAngle)),
      y: center + radius * Math.sin(toRadians(endAngle)),
    };
    const largeArcFlag = angleStep > 180 ? 1 : 0;
    const d =
      `M ${center} ${center} ` +
      `L ${start.x} ${start.y} ` +
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
    return {
      d,
      color,
    };
  });
});

</script>
