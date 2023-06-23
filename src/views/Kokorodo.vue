<template>
  <v-row>
    <h2>必要なこころの選択</h2>
  </v-row>
  <v-row>
    <v-col cols="4" v-for="frame in frames" :key="frame.jobName">
      <v-card>
        <v-card-title>{{ frame.jobName }}</v-card-title>
        <v-card-text>
          <v-checkbox
            v-for="level in frame.routes[0].levels"
            :label="frame.routes[0].name"
            hide-details
            density="compact"
            :key="level.code"
            v-model="state.selectedFrames"
            :value="level.code"
          />
          <v-row>
            <v-col cols="6" v-for="i in 2" :key="i">
              <v-card>
                <v-card-text>
                  <v-checkbox
                    v-for="level in frame.routes[i].levels"
                    :label="frame.routes[i].name + level.level"
                    hide-details
                    density="compact"
                    :key="level.code"
                    v-model="state.selectedFrames"
                    :value="level.code"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="4">
      <v-card>
        <v-card-title>ほかの条件</v-card-title>
        <v-card-text>
          <v-checkbox
            v-model="state.removeRainMonsters"
            label="雨/水辺 限定モンスターを除く"
            hide-details
          />
          <v-checkbox
            v-model="state.removeNightMonsters"
            label="夜 限定モンスターを除く"
            hide-details
          />
          <v-select
            class="mt-2"
            label="地域設定 (未選択の場合は地域限定を除く)"
            v-model="state.selectedPrefecture"
            :items="prefectures"
            item-title="name"
            item-value="code"
            hide-details
            clearable
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row class="mt-12">
    <h2>おすすめクエスト</h2>
  </v-row>
  <div v-for="quests in state.requiredQuests" :key="quests.count">
    <v-row>
      <v-col>
        <h3>入手可能こころ: {{ quests.count }}</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" v-for="quest in quests.quests" :key="quest">
        <v-card>
          <v-card-title>{{ quest }}</v-card-title>
          <v-card-text>
            <v-card
              v-for="monsterName in state.requiredMonsterNamesFromQuest[quest]"
              :key="monsterName"
              class="mb-2"
            >
              <svg
                width="40"
                height="40"
                style="position: absolute; top: 10; right: 10"
              >
                <defs>
                  <radialGradient
                    :id="`gradient-${monsterName}`"
                    cx="10%"
                    cy="10%"
                    r="100%"
                    fx="10%"
                    fy="10%"
                  >
                    <stop offset="0%" style="stop-color: rgb(255, 255, 255)" />
                    <stop
                      offset="100%"
                      :style="`stop-color: ${getColorCode(
                        monsters[monsterName].color
                      )}`"
                    />
                  </radialGradient>
                </defs>

                <circle
                  cx="20"
                  cy="20"
                  r="20"
                  :fill="`url(#gradient-${monsterName})`"
                />
                <text
                  x="50%"
                  y="50%"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  font-size="15"
                  font-weight="bold"
                  fill="white"
                >
                  {{ monsters[monsterName].cost }}
                </text>
              </svg>
              <v-card-title>
                {{ monsterName }}
              </v-card-title>
              <v-card-text>
                <v-chip class="mx-1">
                  {{ monsters[monsterName].frequency }}
                </v-chip>
                <v-chip class="mx-1" v-if="monsters[monsterName].condition">
                  {{ monsters[monsterName].condition }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUtil } from "@/composables/util";

import frames from "@/assets/data/kokorodo/frames.json";
import monstersData from "@/assets/data/kokorodo/monsters.json";
import prefectures from "@/assets/data/kokorodo/prefectures.json";

const router = useRouter();
const route = useRoute();
const util = useUtil();

interface MonsterDetails {
  color: string;
  cost: number;
  frequency: string | null;
  condition: any | null;
  limited_time_events: string[];
  quests: string[];
}

const monsters: Record<string, MonsterDetails> = monstersData;

const monsterNamesFromCode = Object.fromEntries(
  frames
    .flatMap((job) => job.routes)
    .flatMap((route) => route.levels)
    .map((level) => [level.code, level.monsters])
);

const monsterNamesFromQuest: Record<string, string[]> = {};
for (let monsterName in monsters) {
  for (let quest of monsters[monsterName].quests) {
    if (!monsterNamesFromQuest[quest]) {
      monsterNamesFromQuest[quest] = [];
    }
    monsterNamesFromQuest[quest].push(monsterName);
  }
}

const state: {
  selectedFrames: number[];
  selectedPrefecture: number | null;
  removeRainMonsters: boolean;
  removeNightMonsters: boolean;
  requiredMonsters: { name: string; details: MonsterDetails | undefined }[];
  requiredQuests: { count: number; quests: string[] }[];
  requiredMonsterNamesFromQuest: Record<string, string[]>;
} = reactive({
  selectedFrames: [],
  selectedPrefecture: null,
  removeRainMonsters: false,
  removeNightMonsters: false,
  requiredMonsters: computed(() => {
    const monsterNames = state.selectedFrames
      .map((code) => monsterNamesFromCode[code])
      .flat();
    const uniqueMonsterNames = [...new Set(monsterNames)];
    let requiredMonsters = uniqueMonsterNames.map((name) => ({
      name,
      details: monsters[name],
    }));
    if (state.removeNightMonsters) {
      requiredMonsters = requiredMonsters.filter(
        (monster) => monster.details.condition != "夜"
      );
    }
    if (state.removeRainMonsters) {
      requiredMonsters = requiredMonsters.filter(
        (monster) => monster.details.condition != "水"
      );
    }
    if (state.selectedPrefecture) {
      const prefectureMonsters = prefectures.filter(
        (pref) => pref.code == state.selectedPrefecture
      )[0].monsters;
      requiredMonsters = requiredMonsters.filter(
        (monster) =>
          monster.details.condition != "地域" ||
          prefectureMonsters.includes(monster.name)
      );
    } else {
      requiredMonsters = requiredMonsters.filter(
        (monster) => monster.details.condition != "地域"
      );
    }
    return requiredMonsters;
  }),
  requiredQuests: computed(() => {
    const questCounts: { [key: string]: number } = {};
    for (let m of state.requiredMonsters) {
      if (!m.details) continue;
      for (let q of m.details.quests) {
        questCounts[q] = (questCounts[q] || 0) + 1;
      }
    }

    const countsToQuestsMap: { [count: number]: string[] } = {};
    for (let quest in questCounts) {
      const count = questCounts[quest];
      if (countsToQuestsMap[count]) {
        countsToQuestsMap[count].push(quest);
      } else {
        countsToQuestsMap[count] = [quest];
      }
    }

    const sortedCounts = Object.keys(countsToQuestsMap)
      .map(Number)
      .sort((a, b) => b - a);

    return sortedCounts
      .map((count) => ({
        count,
        quests: countsToQuestsMap[count],
      }))
      .filter((item) => item.count >= 2);
  }),
  requiredMonsterNamesFromQuest: computed(() => {
    const requiredMonsterNamesFromQuest: Record<string, string[]> = {};
    for (const monster of state.requiredMonsters) {
      if (monster.details) {
        for (const quest of monster.details.quests) {
          if (requiredMonsterNamesFromQuest[quest]) {
            requiredMonsterNamesFromQuest[quest].push(monster.name);
          } else {
            requiredMonsterNamesFromQuest[quest] = [monster.name];
          }
        }
      }
    }
    return requiredMonsterNamesFromQuest;
  }),
});

const getColorCode = (colorName: string): string => {
  switch (colorName) {
    case "青":
      return "rgb(52, 113, 210)";
    case "紫":
      return "rgb(140, 43, 195)";
    case "黄":
      return "rgb(210, 193, 75)";
    case "緑":
      return "rgb(75, 166, 75)";
    case "赤":
      return "rgb(232, 63, 53)";
    default:
      return "rgb(0, 0, 0)";
  }
};

watch(
  () => [
    state.selectedFrames,
    state.removeNightMonsters,
    state.removeRainMonsters,
    state.selectedPrefecture,
  ],
  () => {
    const query: { [key: string]: string | undefined } = {
      f: util.numberArrayToBase64(state.selectedFrames),
    };
    if (state.removeNightMonsters) query["n"] = "1";
    if (state.removeRainMonsters) query["r"] = "1";
    if (state.selectedPrefecture)
      query["p"] = state.selectedPrefecture.toString();
    router.push({
      name: "kokorodo",
      query: query,
    });
  }
);

const load = async () => {
  if (typeof route.query.f === "string" && route.query.f.length > 0) {
    state.selectedFrames = util.base64ToNumberArray(route.query.f);
  }
  if (typeof route.query.n === "string" && route.query.n.length > 0) {
    state.removeNightMonsters = true;
  }
  if (typeof route.query.r === "string" && route.query.r.length > 0) {
    state.removeRainMonsters = true;
  }
  if (typeof route.query.p === "string" && route.query.p.length > 0) {
    state.selectedPrefecture = parseInt(route.query.p);
  }
};

load();
</script>
