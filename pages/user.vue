<template>
  <div class="text-h5 font-weight-bold">
    <span class="text-primary-2">User</span> Management
  </div>
  <div class="mt-4">
    <v-table class="bg-bg-1" fixed-header height="85vh">
      <thead>
        <tr>
          <th v-for="(header, idx) in headers" :key="idx" class="text-left">
            {{ header }}
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
                <v-btn
                  color="bg-3"
                  v-bind="props"
                  variant="flat"
                  append-icon="mdi-menu-down"
                >
                  Action
                </v-btn>
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
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const listUser = ref([]);
const page = ref(0);
const size = ref(10);
async function handleGetListUser() {
  const { data } = await useFetch(`${baseURL}/admin/user`, {
    method: "GET",
    params: {
      page: page.value,
      size: size.value,
    },
    headers: {
      Authorization: `Bearer ${getCookie("admin_token")}`,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    listUser.value = result;
  }
}

const headers = ref(["Username", "Gmail", "Role", "Banned", "Activated", ""]);
const actions = ref([
  {
    name: "Edit",
    value: "edit",
    icon: "mdi-pencil",
    color: "info",
  },
  {
    name: "Ban",
    value: "ban",
    icon: "mdi-cancel",
    color: "warning",
  },
  {
    name: "Delete",
    value: "delete",
    icon: "mdi-delete",
    color: "error",
  },
]);
onMounted(() => {
  nextTick(() => {
    handleGetListUser();
  });
});
</script>
