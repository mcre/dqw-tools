<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>
          {{ tool.params.title }}<br />
          <span class="text-h6">{{ tool.params.subtitle }}</span>
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2>
          <v-icon start class="mb-1">{{ mdiFootPrint }}</v-icon
          >説明
        </h2>
      </v-col>
      <v-col cols="12">
        <p>
          {{ tool.params.description }}
        </p>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>
          <v-icon start class="mb-1">{{ mdiShieldSwordOutline }}</v-icon>
          パーティの設定
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" v-for="(member, index) in members" :key="index">
        <v-card>
          <v-card-title>{{ index + 1 }}人目のメンバー</v-card-title>
          <v-card-text>
            <v-radio-group inline v-model="member.levelType">
              <v-radio label="基本職" value="basic" />
              <v-radio label="上級職" value="advanced" />
              <v-radio label="特級職" value="special" />
            </v-radio-group>
            <v-slider
              label="レベル"
              step="1"
              min="1"
              :max="maxLevel(member.levelType)"
              thumb-label="always"
              hide-details
              persistent-hint
              v-model="member.level"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-footer app elevation="16">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-slider
            label="平均"
            track-color="default"
            color="primary"
            min="1"
            max="120"
            v-model="averageLevel"
            readonly
            thumb-label="always"
            show-ticks="always"
            :ticks="tickLabels"
            tick-size="8"
            thumb-size="8"
            :messages="metal"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts" setup>
const tool = tools["average-level"];

const util = useUtil();
util.setToolTitle(tool.params);

import { mdiFootPrint, mdiShieldSwordOutline } from "@mdi/js";

type LevelType = "basic" | "advanced" | "special";

interface Member {
  levelType: LevelType;
  level: number;
}

const memberCount = 4;

const members = ref<Member[]>(
  Array.from({ length: memberCount }, () => ({
    levelType: "basic",
    level: 1,
  })),
);

const maxLevel = (type: LevelType): number => {
  switch (type) {
    case "basic":
      return 55;
    case "advanced":
      return 90;
    case "special":
      return 75;
    default:
      return 55;
  }
};

const averageLevel = computed(() => {
  const total = members.value.reduce((acc, member) => {
    const adjustedLevel =
      member.levelType === "special" ? member.level + 45 : member.level;
    return acc + adjustedLevel;
  }, 0);
  const average = total / members.value.length;
  return Math.floor(average * 10) / 10;
});

const tickLabels = [15, 30, 51, 65, 75];

const metal = computed(() => {
  if (averageLevel.value < 15) return "メタルスライム";
  if (averageLevel.value < 30) return "メタルブラザーズ";
  if (averageLevel.value < 51) return "はぐれメタル";
  if (averageLevel.value < 65) return "メタルホイミン";
  if (averageLevel.value < 75) return "ドラゴメタル";
  return "メタルつむり";
});
</script>
