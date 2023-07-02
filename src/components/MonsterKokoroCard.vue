<template>
  <v-card>
    <kokoro-svg
      :color-name="kokorodoStore.monsters[props.monsterName].color"
      :cost="kokorodoStore.monsters[props.monsterName].cost"
    />
    <v-card-title>
      {{ props.monsterName }}
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-chip
            class="mx-0"
            density="compact"
            variant="text"
            size="small"
            :prepend-icon="util.monsterFrequencyDetails(
                      kokorodoStore.monsters[props.monsterName].frequency!
                    ).icon"
          >
            {{
              util.monsterFrequencyDetails(
                kokorodoStore.monsters[props.monsterName].frequency!
              ).text
            }}
          </v-chip>
          <v-chip
            class="mx-0"
            density="compact"
            variant="text"
            size="small"
            v-if="kokorodoStore.monsters[props.monsterName].condition"
            :prepend-icon="
              util.textToIcon(
                kokorodoStore.monsters[props.monsterName].condition
              )
            "
          >
            {{ kokorodoStore.monsters[props.monsterName].condition }}
          </v-chip>
        </v-col>
        <v-col cols="12">
          <v-chip
            v-for="frameCode in kokorodoStore.frameCodesFromMonsterName[
              props.monsterName
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
import { useKokorodoStore } from "@/store/kokorodo";
import { useUtil } from "@/composables/util";

const kokorodoStore = useKokorodoStore();
const util = useUtil();

import KokoroSvg from "@/components/KokoroSvg.vue";

const props = defineProps<{
  monsterName: string;
}>();
</script>
