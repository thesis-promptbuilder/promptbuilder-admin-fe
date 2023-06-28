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
                      @click="
                        selectedUser = user;
                        handleAction(action);
                      "
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
  <v-dialog v-model="isShowCreate" width="auto" persistent="">
    <v-card>
      <v-card-text style="min-width: 25vw">
        <div class="text-h6 font-weight-bold">
          <span class="text-info">Create new user</span>
        </div>
        <v-text-field
          v-model.trim="username"
          autofocus
          class="mt-4"
          variant="outlined"
          bg-color="bg-1"
          density="compact"
          label="Username"
        ></v-text-field>
        <v-text-field
          v-model.trim="gmail"
          variant="outlined"
          bg-color="bg-1"
          density="compact"
          label="Email"
        ></v-text-field>
        <v-text-field
          v-model.trim="password"
          variant="outlined"
          bg-color="bg-1"
          density="compact"
          label="Password"
        ></v-text-field>
        <v-select
          variant="outlined"
          bg-color="bg-1"
          density="compact"
          v-model="role"
          :items="['admin', 'user']"
          label="Role"
        ></v-select>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          variant="text"
          @click="
            username = '';
            gmail = '';
            password = '';
            role = 'user';
            isShowCreate = false;
          "
        >
          Cancel
        </v-btn>
        <v-btn variant="flat" color="info" @click="handleCreateUser">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowDelete" width="auto" persistent="">
    <v-card>
      <v-card-text style="min-width: 25vw">
        <div class="text-h6 font-weight-bold">
          <span class="text-error">Delete user</span>
        </div>
        <div>
          Are you sure to delete
          <span class="font-weight-bold">{{ selectedUser.username }}</span
          >?
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="isShowDelete = false"> Cancel </v-btn>
        <v-btn variant="flat" color="error" @click="handleDeleteUser">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowUpdate" width="auto" persistent="">
    <v-card>
      <v-card-text style="min-width: 25vw">
        <div class="text-h6 font-weight-bold">
          <span class="text-info">Update user</span>
        </div>
        <v-text-field
          v-model.trim="usernameUpdate"
          autofocus
          class="mt-4"
          variant="outlined"
          bg-color="bg-1"
          density="compact"
          label="Username"
        ></v-text-field>
        <v-text-field
          v-model.trim="gmailUpdate"
          variant="outlined"
          bg-color="bg-1"
          density="compact"
          label="Email"
        ></v-text-field>
        <v-text-field
          v-model.trim="passwordUpdate"
          variant="outlined"
          bg-color="bg-1"
          density="compact"
          label="Password"
        ></v-text-field>
        <v-select
          v-model="roleUpdate"
          variant="outlined"
          bg-color="bg-1"
          density="compact"
          :items="['admin', 'user']"
          label="Role"
        ></v-select>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="isShowUpdate = false"> Cancel </v-btn>
        <v-btn variant="flat" color="info" @click="handleUpdateUser">
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { sha256 } from "ohash";
import { useUserStore } from "~/stores/User";

const userStore = useUserStore();

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
    userStore.setListUser(result);
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
const username = ref("");
const gmail = ref("");
const password = ref("");
const role = ref("user");

async function handleCreateUser() {
  const { data } = await useFetch(`${baseURL}/admin/user`, {
    method: "POST",
    body: {
      username: username.value,
      gmail: gmail.value,
      password: sha256(password.value),
      role: role.value,
      is_ban: false,
      is_activate: true,
    },
    headers: {
      Authorization: `Bearer ${getCookie("admin_token")}`,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    isShowCreate.value = false;
    username.value = "";
    gmail.value = "";
    password.value = "";
    role.value = "user";
    useNuxtApp().$toast.success("Create user successfully!");
    page.value = 1;
    size.value = 10;
    handleGetListUser();
  }
}

const isShowDelete = ref(false);
async function handleDeleteUser() {
  const userId = selectedUser.value.id;
  const { data } = await useFetch(`${baseURL}/admin/user/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("admin_token")}`,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    isShowDelete.value = false;
    useNuxtApp().$toast.success("Delete user successfully!");
    handleGetListUser();
  }
}

const isShowUpdate = ref(false);
const usernameUpdate = ref("");
const gmailUpdate = ref("");
const passwordUpdate = ref("");
const roleUpdate = ref("");
async function handleUpdateUser() {
  const userId = selectedUser.value.id;
  const { data } = await useFetch(`${baseURL}/admin/user/${userId}`, {
    method: "PUT",
    body: {
      username: usernameUpdate.value,
      gmail: gmailUpdate.value,
      password: sha256(passwordUpdate.value),
      role: roleUpdate.value,
      // is_ban: false,
      // is_activate: true,
    },
    headers: {
      Authorization: `Bearer ${getCookie("admin_token")}`,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    passwordUpdate.value = "";
    isShowUpdate.value = false;
    useNuxtApp().$toast.success("Update user successfully!");
    handleGetListUser();
  }
}

const selectedUser = ref(null);
function handleAction(action) {
  if (action.value === "edit") {
    usernameUpdate.value = selectedUser.value.username;
    gmailUpdate.value = selectedUser.value.gmail;
    roleUpdate.value = selectedUser.value.role;
    isShowUpdate.value = true;
  }
  if (action.value === "delete") {
    isShowDelete.value = true;
  }
}
</script>
