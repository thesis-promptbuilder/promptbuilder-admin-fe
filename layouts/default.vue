<template>
  <v-layout>
    <v-navigation-drawer>
      <v-list>
        <v-list-item :title="`@${userStore.username}`" class="avatar">
          <template #prepend>
            <v-avatar color="info" class="mr-2">
              <v-icon icon="mdi-account-circle"></v-icon>
            </v-avatar>
          </template>
          <template #subtitle>
            <span
              style="word-break: break-all"
              class="pointer"
              @click="handleCopy"
            >
              {{ userStore.gmail }}
            </span>
          </template>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list mandatory>
        <v-list-item
          v-for="(item, idx) in listItems"
          :key="idx"
          :value="item"
          @click="handleActionItem(item)"
        >
          <template #prepend>
            <v-icon :icon="item.prependIcon" color="black"></v-icon>
          </template>
          <v-list-item-title
            class="text-text-1"
            v-text="item.title"
          ></v-list-item-title>
        </v-list-item>
      </v-list>
      <template #append>
        <div class="pa-4 pb-2 d-flex justify-center">
          <v-btn
            variant="flat"
            block
            prepend-icon="mdi-logout-variant"
            color="primary"
            class="text-none font-weight-bold"
            size="large"
            text="Log out"
            @click="handleLogout"
          >
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main class="text-text-1">
      <div class="ma-4"><slot /></div>
    </v-main>
  </v-layout>
</template>

<script setup>
import { useUserStore } from "~/stores/User";

const userStore = useUserStore();

const listItems = [
  {
    title: "User",
    route: "/user",
    prependIcon: "mdi-account-outline",
  },
  {
    title: "Builder",
    route: "/builder",
    prependIcon: "mdi-wrench-outline",
  },
  {
    title: "Image",
    route: "/image",
    prependIcon: "mdi-image-outline",
  },
  // {
  //   title: "Statistics",
  //   route: "/statistics",
  //   prependIcon: "mdi-chart-line",
  // },
];

function handleActionItem(item) {
  navigateTo(item["route"]);
}

function handleLogout() {
  userStore.reset();
  document.cookie = "admin_token=;";
  document.cookie = "admin_expire=;";
  setTimeout(() => {
    navigateTo("/login");
  }, 200);
}

function handleCopy() {
  navigator.clipboard.writeText(userStore.gmail);
  useNuxtApp().$toast.success("Copy email");
}
</script>
