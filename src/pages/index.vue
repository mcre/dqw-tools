<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>DQW TOOLS</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p>
          DQW(ドラゴンクエストウォーク)のプレイに役立つツール集。こころ道
          周回クエスト検索ツールなど。
        </p>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>
          <v-icon start>{{ mdiToolbox }}</v-icon>
          ツール一覧
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" v-for="(tool, key) in tools" :key="key">
        <v-card
          :title="tool.params.title"
          :subtitle="tool.params.subtitle"
          :to="tool.params.path"
          :text="tool.params.description"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>
          <v-icon start class="mb-1">{{ mdiScaleBalance }}</v-icon>
          利用規約
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <p>
          当ウェブサイトで提供されるサービスやコンテンツは、あくまで参考としてご利用ください。その正確性や信頼性については保証いたしかねますので、利用者ご自身の判断と責任でご利用ください。
        </p>
        <p>
          また、当サイトの利用に関連して生じた損害等に関して、運営者は一切の責任を負いません。予告なく内容の変更や提供の終了を行うことがありますので、あらかじめご了承ください。
        </p>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2>
          <v-icon start class="mb-1">{{ mdiInformationOutline }}</v-icon>
          参考情報
        </h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="6">
        <v-btn
          class="mb-1 mr-2"
          href="https://mcre.info"
          target="_blank"
          rel="noopener noreferrer"
          :icon="mdiAccountCircle"
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
          :icon="mdiGithub"
          size="small"
        />
        このWebアプリのソースコード・要望
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { useHead } from "@unhead/vue";
const headerUtil = useHeaderUtil();
useHead(headerUtil.getHead());

import {
  mdiToolbox,
  mdiScaleBalance,
  mdiInformationOutline,
  mdiAccountCircle,
  mdiGithub,
} from "@mdi/js";
</script>
