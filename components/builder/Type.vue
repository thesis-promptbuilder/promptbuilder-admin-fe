<template>
  <v-table class="bg-bg-1" fixed-header height="75vh">
    <thead>
      <tr>
        <th v-for="(header, idx) in headers" :key="idx" class="text-left">
          <v-btn
            v-if="header === 'Action'"
            prepend-icon="mdi-plus"
            variant="flat"
            color="info"
            text="New Builder Type"
            @click="isShowCreate = true"
          ></v-btn>
          <span v-else>{{ header }}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="builderType in styleStore.listBuilderType"
        :key="builderType.id"
      >
        <td>{{ builderType.name }}</td>
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
                    selectedBuilderType = builderType;
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
      :length="length"
      density="comfortable"
      class="mt-1"
      active-color="primary"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      variant="flat"
      :total-visible="5"
    ></v-pagination>
  </div>
  <CommonDialog
    v-model="isShowCreate"
    button-confirm="Create"
    type="info"
    title="Create builder type"
    @handle-close="isShowCreate = false"
    @handle-confirm="handleCreate"
  >
    <template #customSlot>
      <v-text-field
        v-model.trim="name"
        autofocus
        class="mt-4"
        variant="outlined"
        density="compact"
        label="Name"
      ></v-text-field>
    </template>
  </CommonDialog>
  <CommonDialog
    v-model="isShowDelete"
    button-confirm="Delete"
    type="error"
    title="Delete builder type"
    :content="`Are you sure to delete ${selectedBuilderType?.name}?`"
    @handle-close="isShowDelete = false"
    @handle-confirm="handleDelete"
  >
  </CommonDialog>
  <CommonDialog
    v-model="isShowUpdate"
    button-confirm="Update"
    type="info"
    title="Update builder type"
    :content="`Update ${selectedBuilderType?.name}`"
    @handle-close="isShowUpdate = false"
    @handle-confirm="handleUpdate"
  >
    <template #customSlot>
      <v-text-field
        v-model.trim="nameUpdate"
        autofocus
        variant="outlined"
        hide-details=""
        density="compact"
        label="Name"
      ></v-text-field>
    </template>
  </CommonDialog>
</template>

<script setup>
import { useStyleStore } from "~/stores/Style";

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const styleStore = useStyleStore();

const headers = ref(["Name", "Action"]);
const page = ref(1);
const size = ref(10);
const length = ref(10);

const selectedBuilderType = ref(null);
function handleAction(action) {
  if (action.value === "edit") {
    isShowUpdate.value = true;
    nameUpdate.value = selectedBuilderType.value?.name;
  }
  if (action.value === "delete") {
    isShowDelete.value = true;
  }
}

const isLoadingGetList = ref(false);
async function handleGetList() {
  isLoadingGetList.value = true;
  const { data } = await useFetch(`${baseURL}/builder_type`, {
    method: "GET",
    params: {
      page: page.value - 1,
      size: size.value,
    },
  });
  isLoadingGetList.value = false;
  if (!data.value) return;
  const { result, count, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    styleStore.setListBuilderType(result);
    length.value = parseInt(count / size.value) + 1;
  }
}

watch(
  () => page.value,
  () => {
    handleGetList();
  }
);

onMounted(() => {
  nextTick(() => handleGetList());
});

const name = ref("");
const isShowCreate = ref(false);
const isLoadingCreate = ref(false);
async function handleCreate() {
  isLoadingCreate.value = true;
  const { data } = await useFetch(`${baseURL}/builder_type`, {
    method: "POST",
    body: {
      name: name.value,
    },
    headers: {
      Authorization: `Bearer ${getCookie("admin_token")}`,
    },
  });
  isLoadingCreate.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success(`Create ${name.value} successfully!`);
    name.value = "";
    page.value = 1;
    handleGetList();
  }
}

const isShowDelete = ref(false);
async function handleDelete() {
  const { data } = await useFetch(
    `${baseURL}/builder_type/${selectedBuilderType.value.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("admin_token")}`,
      },
    }
  );
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Delete successfully!");
    isShowDelete.value = false;
    page.value = 1;
    handleGetList();
  }
}

const nameUpdate = ref("");
const isShowUpdate = ref(false);
async function handleUpdate() {
  const { data } = await useFetch(
    `${baseURL}/builder_type/${selectedBuilderType.value.id}`,
    {
      method: "PUT",
      body: {
        name: nameUpdate.value,
      },
      headers: {
        Authorization: `Bearer ${getCookie("admin_token")}`,
      },
    }
  );
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Update successfully!");
    isShowUpdate.value = false;
    handleGetList();
  }
}
</script>
