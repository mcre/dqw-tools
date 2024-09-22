<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>
          {{ tool.title }}<br />
          <span class="text-h6">{{ tool.subtitle }}</span>
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2><v-icon start class="mb-1">mdi-foot-print</v-icon>説明</h2>
      </v-col>
      <v-col cols="12">
        <p>
          下の
          <v-btn
            class="mb-1"
            href="#select"
            variant="outlined"
            density="compact"
          >
            欲しいこころの選択
          </v-btn>
          から、欲しいこころ道の枠をチェックすることで、
          <v-btn
            class="mb-1"
            href="#quests"
            variant="outlined"
            density="compact"
          >
            周回おすすめクエスト
          </v-btn>
          に入手可能なこころの数が多い順でクエストが表示されます。
        </p>
        <p>
          チェックの状態はURLに保存されるので、そのままブックマークすることで次回も同じ内容を表示することができます。
        </p>
        <v-col cols="12">
          <v-text-field
            v-model="fullPath"
            label="URL"
            variant="solo"
            hide-details
            readonly
            append-inner-icon="mdi-content-copy"
            @click:append-inner="
              util.copyToClipboard(fullPath);
              snackbar = true;
            "
          />
        </v-col>
        <v-snackbar v-model="snackbar">
          URLをクリップボードにコピーしました
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row id="select">
      <v-col cols="12">
        <h2>
          <v-icon start class="mb-1">mdi-heart-circle</v-icon>欲しいこころの選択
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="frame in kokorodoStore.frames"
        :key="frame.jobName"
      >
        <v-card>
          <v-card-title>{{ frame.jobName }}</v-card-title>
          <v-card-text>
            <v-checkbox
              v-for="level in frame.routes[0].levels"
              :label="frame.routes[0].name"
              hide-details
              density="compact"
              :key="level.code"
              v-model="selectedFrames"
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
                      v-model="selectedFrames"
                      :value="level.code"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-title>ほかの条件</v-card-title>
          <v-card-text>
            <v-checkbox
              v-model="removeRainMonsters"
              label="雨/水辺 限定モンスターを除く"
              hide-details
            />
            <v-checkbox
              v-model="removeNightMonsters"
              label="夜 限定モンスターを除く"
              hide-details
            />
            <v-select
              class="mt-2"
              label="地域設定(未選択の場合は地域限定を除く)"
              v-model="selectedPrefecture"
              :items="kokorodoStore.prefectures"
              item-title="name"
              item-value="code"
              hide-details
              clearable
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row class="mt-12" id="quests">
      <v-col cols="12">
        <h2>
          <v-icon start class="mb-1">mdi-book-open-page-variant</v-icon>
          周回おすすめクエスト
        </h2>
      </v-col>
    </v-row>
    <v-expansion-panels
      v-if="requiredQuests.length > 0"
      class="mt-6"
      multiple
      :model-value="requiredQuests.slice(0, 2).map((item) => item.count)"
    >
      <v-expansion-panel
        v-for="quests in requiredQuests"
        :key="quests.count"
        :value="quests.count"
      >
        <v-expansion-panel-title>
          <h3>
            <v-icon start>mdi-bullseye-arrow</v-icon>
            入手可能こころ: {{ quests.count }}
          </h3>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row class="my-2">
            <v-col
              cols="12"
              md="6"
              lg="4"
              v-for="(quest, index) in quests.quests"
              :key="index"
            >
              <v-card>
                <v-card-title>
                  <v-icon class="mb-1">mdi-compass-outline</v-icon>
                  {{ quest.questNames[0] }}
                  <v-tooltip location="end">
                    <template v-slot:activator="{ props }">
                      <v-chip
                        v-bind="props"
                        v-if="quest.questNames.length > 1"
                        class="mb-1"
                        color="primary"
                        density="comfortable"
                      >
                        他<small>{{ quest.questNames.length - 1 }}</small>
                      </v-chip>
                    </template>
                    <span v-html="quest.questNames.slice(1).join('<br />')" />
                  </v-tooltip>
                </v-card-title>
                <v-card-text>
                  <monster-kokoro-card
                    v-for="monsterName in quest.monsterNames"
                    :key="monsterName"
                    :monster-name="monsterName"
                    show-story-conditions
                    class="mb-2"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row v-else>
      <v-col cols="12" sm="6" md="4" lg="4">
        <v-alert border="start" elevation="6" outlined>
          <p>結果サンプル</p>
          <v-img
            class="mt-2"
            src="/img/kokorodo-sample.png"
            alt="結果サンプル"
            eager
          />
        </v-alert>
      </v-col>
    </v-row>
    <v-row class="mt-12" id="quests" v-if="requiredNonQuestMonsters.length > 0">
      <v-col cols="12">
        <h2>
          <v-icon start class="mb-1">mdi-ghost</v-icon>
          期間限定モンスター等
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="6"
        lg="4"
        v-for="monster in requiredNonQuestMonsters"
        :key="monster.name"
      >
        <monster-kokoro-card
          :monster-name="monster.name"
          show-limited-time-events
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
const tool = tools.kokorodo;

const router = useRouter();
const route = useRoute();
const kokorodoStore = useKokorodoStore();
const util = useUtil();
util.setTitle(`${tool.title} ${tool.subtitle}`, tool.description);

const fullPath = ref(
  `https://${import.meta.env.VITE_DISTRIBUTION_DOMAIN_NAME}${route.fullPath}`
);
const snackbar = ref(false);
const selectedFrames = ref<number[]>([]);
const selectedPrefecture = ref<number | null>(null);
const removeRainMonsters = ref(false);
const removeNightMonsters = ref(false);

const requiredMonstersBeforeConsideringPrefectures = computed(() => {
  const monsterNames = selectedFrames.value
    .map((code) => kokorodoStore.monsterNamesFromFrameCode[code])
    .flat();
  const uniqueMonsterNames = [...new Set(monsterNames)];
  let requiredMonsters = uniqueMonsterNames.map((name) => ({
    name,
    details: kokorodoStore.monsters[name],
  }));
  if (removeNightMonsters.value) {
    requiredMonsters = requiredMonsters.filter(
      (monster) => monster.details?.condition != "夜"
    );
  }
  if (removeRainMonsters.value) {
    requiredMonsters = requiredMonsters.filter(
      (monster) => monster.details?.condition != "水"
    );
  }
  return requiredMonsters;
});

const requiredMonsters = computed(() => {
  let requiredMonsters = requiredMonstersBeforeConsideringPrefectures.value;
  if (selectedPrefecture.value) {
    const prefectureMonsters = kokorodoStore.prefectures.filter(
      (pref) => pref.code == selectedPrefecture.value
    )[0].monsters;
    requiredMonsters = requiredMonsters.filter(
      (monster) =>
        monster.details?.condition != "地域" ||
        prefectureMonsters.includes(monster.name)
    );
  } else {
    requiredMonsters = requiredMonsters.filter(
      (monster) => monster.details?.condition != "地域"
    );
  }
  return requiredMonsters;
});

const requiredQuests = computed(() => {
  const questsToMonsters: Record<string, string[]> = requiredMonsters.value
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
      let questGroup = acc.find((qg) => qg.monsterNamesKey === monsterNamesKey);
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
      (acc[questGroup.count] || (acc[questGroup.count] = [])).push(questGroup);
      return acc;
    }, {} as Record<number, typeof questGroups>);

  return Object.entries(questGroupsByCount)
    .map(([count, questGroups]) => ({
      count: Number(count),
      quests: questGroups.map(({ questNames, monsterNames }) => ({
        questNames,
        monsterNames: sortByFrequency(monsterNames),
      })),
    }))
    .sort((a, b) => b.count - a.count);
});

const requiredNonQuestMonsters = computed(() => {
  return requiredMonstersBeforeConsideringPrefectures.value
    .filter(
      (monster) =>
        (monster.details && monster.details.quests.length == 0) ||
        (monster.details && monster.details.condition == "地域")
    )
    .sort((a, b) => a.name.localeCompare(b.name));
});

const sortByFrequency = (monsterNames: string[]): string[] => {
  return [...monsterNames].sort((a, b) => {
    const freqLevelA = util.monsterFrequencyDetails(
      kokorodoStore.monsters[a].frequency!
    ).level;
    const freqLevelB = util.monsterFrequencyDetails(
      kokorodoStore.monsters[b].frequency!
    ).level;
    return freqLevelB - freqLevelA || a.localeCompare(b);
  });
};

watch(
  () => [
    selectedFrames.value,
    removeNightMonsters.value,
    removeRainMonsters.value,
    selectedPrefecture.value,
  ],
  () => {
    const query: { [key: string]: string } = {
      f: util.numberArrayToBase64(selectedFrames.value),
    };
    if (removeNightMonsters.value) query["n"] = "1";
    if (removeRainMonsters.value) query["r"] = "1";
    if (selectedPrefecture.value)
      query["p"] = selectedPrefecture.value.toString();
    router.push({
      name: route.name!,
      query: query,
    });
    fullPath.value = `https://${import.meta.env.VITE_DISTRIBUTION_DOMAIN_NAME}${
      route.path
    }?${new URLSearchParams(query).toString()}`;
    util.updateOgp();
  }
);

const load = async () => {
  if (typeof route.query.f === "string" && route.query.f.length > 0) {
    selectedFrames.value = util.base64ToNumberArray(route.query.f);
  }
  if (typeof route.query.n === "string" && route.query.n.length > 0) {
    removeNightMonsters.value = true;
  }
  if (typeof route.query.r === "string" && route.query.r.length > 0) {
    removeRainMonsters.value = true;
  }
  if (typeof route.query.p === "string" && route.query.p.length > 0) {
    selectedPrefecture.value = parseInt(route.query.p);
  }
};

load();
</script>
