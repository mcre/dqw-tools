<template>
  <v-card>
    <kokoro-svg
      :color-name="kokorodoStore.monsters[monsterName].color"
      :cost="kokorodoStore.monsters[monsterName].cost"
    />
    <v-card-title>
      {{ monsterName }}
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" v-if="showStoryConditions">
          <v-chip
            class="mx-0"
            density="compact"
            variant="text"
            size="small"
            :prepend-icon="util.monsterFrequencyDetails(
              kokorodoStore.monsters[monsterName].frequency!
            ).icon"
          >
            {{
              util.monsterFrequencyDetails(
                kokorodoStore.monsters[monsterName].frequency!
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
              util.textToIcon(kokorodoStore.monsters[monsterName].condition)
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
        <v-col
          cols="12"
          class="pt-0"
          v-if="kokorodoStore.monsters[monsterName].memo"
        >
          <v-alert
            density="compact"
            :text="kokorodoStore.monsters[monsterName].memo"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const kokorodoStore = useKokorodoStore();
const util = useUtil();

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
