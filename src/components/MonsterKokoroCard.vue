<template>
  <v-card>
    <kokoro-svg
      :color-name="kokorodoStore.monsters[monsterName].color"
      :cost="kokorodoStore.monsters[monsterName].cost"
    />
    <v-card-title>
      {{ monsterName }}
      <v-tooltip v-if="kokorodoStore.monsters[monsterName].memo">
        <template v-slot:activator="{ props }">
          <v-chip v-bind="props" class="mb-1" color="primary" density="compact">
            覚醒メモ
          </v-chip>
        </template>
        <span>{{ kokorodoStore.monsters[monsterName].memo }}</span>
      </v-tooltip>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" v-if="showStoryConditions">
          <v-chip
            class="mx-0"
            density="compact"
            variant="text"
            size="small"
            :prepend-icon="
              kokorodoUtil.monsterFrequencyDetails(
                kokorodoStore.monsters[monsterName].frequency!,
              ).icon
            "
          >
            {{
              kokorodoUtil.monsterFrequencyDetails(
                kokorodoStore.monsters[monsterName].frequency!,
              ).text
            }}
          </v-chip>
          <v-chip
            class="mx-0"
            density="compact"
            variant="text"
            size="small"
            v-if="kokorodoStore.monsters[monsterName].condition"
            :prepend-icon="
              kokorodoUtil.textToIcon(
                kokorodoStore.monsters[monsterName].condition,
              )
            "
          >
            {{ kokorodoStore.monsters[monsterName].condition }}
          </v-chip>
        </v-col>
        <v-col cols="12" v-if="showLimitedTimeEvents">
          <v-chip
            v-for="event in kokorodoStore.monsters[monsterName]
              .limitedTimeEvents"
            :key="event"
            class="mr-1"
            density="compact"
          >
            {{ event }}
          </v-chip>
          <v-chip
            v-if="kokorodoStore.monsters[monsterName].condition == '地域'"
            class="mr-1"
            density="compact"
          >
            地域
          </v-chip>
        </v-col>
        <v-col cols="12" class="pt-0">
          <v-chip
            v-for="frameCode in kokorodoStore.frameCodesFromMonsterName[
              monsterName
            ]"
            :key="frameCode"
            class="mr-1"
            density="compact"
            size="small"
            color="primary"
            label
          >
            {{ kokorodoStore.frameNameFromCode[frameCode] }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const kokorodoStore = useKokorodoStore();
const kokorodoUtil = useKokorodoUtil();

defineProps({
  monsterName: {
    type: String,
    required: true,
  },
  showStoryConditions: {
    type: Boolean,
    default: false,
  },
  showLimitedTimeEvents: {
    type: Boolean,
    default: false,
  },
});
</script>
