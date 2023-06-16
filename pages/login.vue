<template>
  <div
    class="d-flex justify-center align-center flex-column"
    style="height: 100vh"
  >
    <div style="width: 500px" class="bg-bg-1 rounded-lg pa-8">
      <div class="text-h4 font-weight-bold d-flex justify-center">
        Admin Dashboard
      </div>
      <v-text-field
        v-model.trim="gmail"
        variant="outlined"
        label="Email"
        class="mt-6"
        prepend-inner-icon="mdi-email-outline"
        placeholder="xxx@gmail.com"
      ></v-text-field>
      <v-text-field
        v-model.trim="password"
        variant="outlined"
        label="Password"
        type="password"
        prepend-inner-icon="mdi-panda"
        placeholder="Abc@123"
      ></v-text-field>
      <v-btn
        variant="flat"
        color="primary"
        text="Login"
        block
        size="x-large"
        class="text-none font-weight-bold"
        :loading="isLoadingLogin"
        @click="handleLogin"
      ></v-btn>
    </div>
  </div>
</template>

<script setup>
import { sha256 } from "ohash";
import { useUserStore } from "~/stores/User";
const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

definePageMeta({
  layout: "authen",
});

const gmail = ref("");
const password = ref("");

const userStore = useUserStore();

const isLoadingLogin = ref(false);

async function handleLogin() {
  isLoadingLogin.value = true;
  const { data } = await useFetch(`${baseURL}/user/login`, {
    method: "POST",
    body: {
      gmail: gmail,
      password: sha256(password.value),
    },
  });
  isLoadingLogin.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    userStore.setUser(result);
    document.cookie = `admin_token=${result["access_token"]}`;
    document.cookie = `admin_exp=${result["expire_time"]}`;
    navigateTo({ path: "/" });
  }
}
</script>
