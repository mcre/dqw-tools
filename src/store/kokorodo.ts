import { defineStore } from "pinia";

import framesData from "@/assets/data/kokorodo/frames.json";
import monstersData from "@/assets/data/kokorodo/monsters.json";
import prefecturesData from "@/assets/data/kokorodo/prefectures.json";

interface FrameLevel {
  code: number;
  level: number;
  monsters: string[];
}

interface Route {
  name: string;
  levels: FrameLevel[];
}

interface Frame {
  jobName: string;
  routes: Route[];
}

interface Prefecture {
  code: number;
  name: string;
  monsters: string[];
}

export interface MonsterDetails {
  color: string;
  cost: number;
  frequency: string | null;
  condition: any | null;
  limitedTimeEvents: string[];
  quests: string[];
  memo?: string;
}

export const useKokorodoStore = defineStore("kokorodo", {
  state: () => {
    return {
      frames: framesData as Frame[],
      monsters: monstersData as Record<string, MonsterDetails>,
      prefectures: prefecturesData as Prefecture[],
    };
  },
  getters: {
    monsterNamesFromFrameCode: (state) =>
      Object.fromEntries(
        state.frames
          .flatMap((job) => job.routes)
          .flatMap((route) => route.levels)
          .map((level) => [level.code, level.monsters])
      ),
    monsterAndFrameCodePairs: (state) =>
      state.frames.flatMap((frame) =>
        frame.routes.flatMap((route) =>
          route.levels.flatMap((level) =>
            level.monsters.map((monster) => ({ monster, code: level.code }))
          )
        )
      ),
    frameNameFromCode: (state) =>
      state.frames
        .flatMap(({ jobName, routes }) =>
          routes.flatMap(({ name, levels }) =>
            levels.map(({ code, level }) => ({
              [code]: `${jobName} ${name}${level}`,
            }))
          )
        )
        .reduce((acc, current) => ({ ...acc, ...current }), {}),
    monsterNamesFromQuest(state) {
      const ret: Record<string, string[]> = {};
      for (const monsterName in state.monsters) {
        for (const quest of state.monsters[monsterName].quests) {
          if (!this.monsterNamesFromQuest[quest]) {
            this.monsterNamesFromQuest[quest] = [];
          }
          this.monsterNamesFromQuest[quest].push(monsterName);
        }
      }
      return ret;
    },
    frameCodesFromMonsterName(): Record<string, number[]> {
      return this.monsterAndFrameCodePairs.reduce(
        (acc: Record<string, number[]>, { monster, code }) => {
          if (!acc[monster]) {
            acc[monster] = [];
          }
          acc[monster].push(code);
          return acc;
        },
        {}
      );
    },
  },
});
