<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>DQW Tools</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p>
          DQW(ドラゴンクエストウォーク)のプレイに役立つツール集。こころ道周回クエスト検索ツールなど。
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-btn
          class="mb-1 mr-2"
          href="https://mcre.info"
          target="_blank"
          rel="noopener noreferrer"
          icon="mdi-account-circle"
          size="small"
        />
        作者について
      </v-col>
      <v-col cols="12" sm="6">
        <v-btn
          class="mb-1 mr-2"
          href="https://github.com/mcre/dqw-tools"
          target="_blank"
          rel="noopener noreferrer"
          icon="mdi-github"
          size="small"
        />
        このWebアプリのソースコード・要望
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2><v-icon start class="mb-1">mdi-toolbox</v-icon>ツール一覧</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card
          title="こころ道"
          subtitle="周回クエスト検索ツール"
          text="ほしいこころ道の枠を選択することで、入手可能なこころの数が多い順でクエストが表示されます"
          :to="{ name: 'kokorodo' }"
        />
      </v-col>
      <v-col cols="12">
        <v-card
          title="メタルキャンペーン"
          subtitle="平均レベル計算ツール"
          text="メンバー4人分のレベルを選択することにより、平均レベルが計算されます。メタルキャーンペーン（メタルの群れ）の場合にどのメタルが出現するかも併せて表示されます。"
          :to="{ name: 'average-level' }"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useUtil } from "@/composables/util";

const util = useUtil();
util.setTitle("");
</script>
