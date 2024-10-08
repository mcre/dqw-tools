<template>
  <v-app>
    <v-app-bar flat density="comfortable">
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          variant="text"
          @click.stop="drawer = !drawer"
          aria-label="メニューを開閉する"
        />
      </template>
      <v-app-bar-title>
        <v-btn to="/" variant="text" :active="false">DQW TOOLS</v-btn>
      </v-app-bar-title>
      <template v-slot:append>
        <x-share-button class="mr-1" />
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list :role="null">
        <v-list-item
          two-line
          :to="tool.params.path"
          v-for="(tool, key) in tools"
          :key="key"
        >
          <v-list-item-title>{{ tool.params.title }}</v-list-item-title>
          <v-list-item-subtitle>{{
            tool.params.subtitle
          }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main style="--v-layout-top: 56px">
      <v-container max-width="1140">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
const drawer = ref(false);
</script>
