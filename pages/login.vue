<template>
  <div class="width-100">
    <div class="text-h4 font-weight-bold">Log In</div>
    <div class="mt-1">Admin management</div>
    <div class="mt-7">Email</div>
    <v-text-field
      v-model="gmail"
      class="mt-1"
      variant="outlined"
      hide-details
      prepend-inner-icon="mdi-email-outline"
      placeholder="xxx@gmail.com"
    ></v-text-field>
    <div class="mt-4">Password</div>
    <v-text-field
      v-model="password"
      class="mt-1"
      variant="outlined"
      hide-details
      type="password"
      prepend-inner-icon="mdi-panda"
      placeholder="Abc@123"
    ></v-text-field>
    <v-btn
      block
      class="mt-8 font-weight-bold text-text-1"
      size="x-large"
      variant="flat"
      color="primary"
      text="Log In"
      @click="handleLogin"
    />
  </div>
</template>

<script setup>
import { sha256 } from "ohash";
import { useUserStore } from "~/stores/User";

definePageMeta({
  layout: "authen",
});
const gmail = ref("");
const password = ref("");
const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/user`;

const userStore = useUserStore();

async function handleLogin() {
  const { data } = await useFetch(`${baseURL}/login`, {
    method: "POST",
    body: {
      gmail: gmail,
      password: sha256(password.value),
    },
  });
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    userStore.setUser({ gmail: gmail.value });
    window?.localStorage.setItem("thesis-token", result["access_token"]);
    navigateTo({ path: "/builder" });
  }
}
</script>
