<template>
  <v-app>
    <v-app-bar flat>
      <template v-slot:prepend>
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
      </template>
      <v-app-bar-title>
        <v-btn to="/" variant="text" :active="false">DQW TOOLS</v-btn>
      </v-app-bar-title>
      <template v-slot:append>
        <x-share-button class="mr-1" />
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item
          two-line
          :to="tool.to"
          v-for="(tool, key) in tools"
          :key="key"
        >
          <v-list-item-title>{{ tool.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ tool.subtitle }}</v-list-item-subtitle>
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
import tools from "@/consts/tools";
import XShareButton from "./components/XShareButton.vue";

const drawer = ref(false);
</script>
