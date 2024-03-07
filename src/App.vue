<template>
  <v-app>
    <v-app-bar flat>
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
      </template>
      <v-app-bar-title>
        <v-btn
          :to="{ name: 'home' }"
          variant="text"
          :active="false"
          class="text-capitalize"
          >DQW Tools</v-btn
        >
      </v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item two-line :to="{ name: 'kokorodo', query: route.query }">
          <v-list-item-title>こころ道</v-list-item-title>
          <v-list-item-subtitle>周回クエスト検索ツール</v-list-item-subtitle>
        </v-list-item>
        <v-list-item
          two-line
          :to="{ name: 'average-level', query: route.query }"
        >
          <v-list-item-title>メタルキャンペーン</v-list-item-title>
          <v-list-item-subtitle>平均レベル計算ツール</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

const drawer = ref(false);
</script>
