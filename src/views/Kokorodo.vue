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
      <v-col cols="3" v-for="(quest, index) in quests.quests" :key="index">
        <v-card>
          <v-card-title>
            {{ quest.questNames[0] }}
            <v-tooltip location="end">
              <template v-slot:activator="{ props }">
                <v-chip
                  v-bind="props"
                  v-if="quest.questNames.length > 2"
                  class="mb-1"
                  color="primary"
                  density="comfortable"
                >
                  他
                </v-chip>
              </template>
              <span v-html="quest.questNames.join('<br />')" />
            </v-tooltip>
          </v-card-title>
          <v-card-text>
            <v-card
              v-for="monsterName in quest.monsterNames"
              :key="monsterName"
              class="mb-2"
            >
              <kokoro-svg
                :color-name="monsters[monsterName].color"
                :cost="monsters[monsterName].cost"
              />
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

import KokoroSvg from "@/components/KokoroSvg.vue";

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
  requiredQuests: {
    count: number;
    quests: {
      questNames: string[];
      monsterNames: string[];
    }[];
  }[];
  requiredMonsterNamesFromQuest: Record<string, string[]>;
} = reactive({
  selectedFrames: [] as number[],
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
    const questsToMonsters: Record<string, string[]> = state.requiredMonsters
      .filter((m) => m.details)
      .reduce((acc, m) => {
        m.details!.quests.forEach((q) => {
          acc[q] = (acc[q] || []).concat(m.name);
        });
        return acc;
      }, {} as Record<string, string[]>);

    const questGroups = Object.entries(questsToMonsters)
      .map(([questName, monsterNames]) => {
        const monsterNamesKey = monsterNames.sort().join("|");
        return { questName, monsterNames, monsterNamesKey };
      })
      .reduce((acc, { questName, monsterNames, monsterNamesKey }) => {
        let questGroup = acc.find(
          (qg) => qg.monsterNamesKey === monsterNamesKey
        );
        if (questGroup) {
          questGroup.questNames.push(questName);
        } else {
          acc.push({
            questNames: [questName],
            count: monsterNames.length,
            monsterNames,
            monsterNamesKey,
          });
        }
        return acc;
      }, [] as { questNames: string[]; count: number; monsterNames: string[]; monsterNamesKey: string }[]);

    const questGroupsByCount: Record<number, typeof questGroups> =
      questGroups.reduce((acc, questGroup) => {
        (acc[questGroup.count] || (acc[questGroup.count] = [])).push(
          questGroup
        );
        return acc;
      }, {} as Record<number, typeof questGroups>);

    return Object.entries(questGroupsByCount)
      .map(([count, questGroups]) => ({
        count: Number(count),
        quests: questGroups.map(({ questNames, monsterNames }) => ({
          questNames,
          monsterNames,
        })),
      }))
      .filter(({ count }) => count > 1)
      .sort((a, b) => b.count - a.count);
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