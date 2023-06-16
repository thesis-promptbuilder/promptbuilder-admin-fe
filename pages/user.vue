<template>
  <div class="text-h5 font-weight-bold">
    <span class="text-primary-2">User</span> Management
  </div>
  <div class="mt-4">
    <div v-if="isLoadingGet" class="d-flex justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else>
      <v-table class="bg-bg-1" fixed-header height="80vh">
        <thead>
          <tr>
            <th v-for="(header, idx) in headers" :key="idx" class="text-left">
              <v-btn
                v-if="header === 'Action'"
                prepend-icon="mdi-plus"
                variant="flat"
                color="info"
                text="New user"
                @click="isShowCreate = true"
              ></v-btn>
              <span v-else>{{ header }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in listUser" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.gmail }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.is_ban }}</td>
            <td>{{ user.is_activate }}</td>
            <td>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props" variant="outlined"> Action </v-btn>
                </template>
                <v-list>
                  <v-list-item v-for="(action, index) in actions" :key="index">
                    <v-btn
                      class="text-none"
                      :text="action.name"
                      :color="action.color"
                      :prepend-icon="action.icon"
                      block
                    >
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-table>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="10"
          density="comfortable"
          class="mt-1"
          active-color="primary"
          prev-icon="mdi-menu-left"
          next-icon="mdi-menu-right"
          variant="flat"
          :total-visible="5"
        ></v-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const listUser = ref([]);
const isLoadingGet = ref(false);
const page = ref(1);
const size = ref(10);
async function handleGetListUser() {
  isLoadingGet.value = true;
  const { data } = await useFetch(`${baseURL}/admin/user`, {
    method: "GET",
    params: {
      page: page.value - 1,
      size: size.value,
    },
    headers: {
      Authorization: `Bearer ${getCookie("admin_token")}`,
    },
  });
  isLoadingGet.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    listUser.value = result;
  }
}

watch(
  () => page.value,
  () => {
    handleGetListUser();
  }
);

const headers = ref([
  "Username",
  "Gmail",
  "Role",
  "Banned",
  "Activated",
  "Action",
]);

onMounted(() => {
  nextTick(() => {
    handleGetListUser();
  });
});

const isShowCreate = ref(false);
</script>
