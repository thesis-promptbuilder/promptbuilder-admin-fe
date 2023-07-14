<template>
  <v-select
    v-model="builderType"
    variant="outlined"
    density="comfortable"
    class="w-25"
    :items="styleStore.listBuilderType.map((item) => item.name)"
  ></v-select>
  <v-table class="bg-bg-1" fixed-header height="65vh">
    <thead>
      <tr>
        <th
          v-for="(header, idx) in headers"
          :key="idx"
          class="text-left"
          :class="[header === 'Image' ? 'text-center' : '']"
        >
          <v-btn
            v-if="header === 'Action'"
            prepend-icon="mdi-plus"
            variant="flat"
            color="info"
            text="New Builder Value"
            @click="isShowCreate = true"
          ></v-btn>
          <span v-else>{{ header }}</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="builderValue in listValue" :key="builderValue?.id">
        <td>{{ builderValue.name }}</td>
        <td class="d-flex justify-center pa-2" style="height: 250px">
          <v-img :src="`${builderValue.image_src}`"></v-img>
        </td>
        <td>
          <v-btn
            color="error"
            text="Delete"
            class="text-none"
            prepend-icon="mdi-delete"
            @click="handleDelete(builderValue)"
          ></v-btn>
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
    title="Create builder value"
    @handle-close="
      isShowCreate = false;
      handleReset();
    "
    @handle-confirm="handleCreate"
  >
    <template #customSlot>
      <v-text-field
        v-model.trim="builderType"
        readonly
        class="mt-4"
        variant="outlined"
        density="compact"
        hide-details
        bg-color="bg-3"
      ></v-text-field>
      <v-text-field
        v-model.trim="name"
        autofocus=""
        class="mt-4"
        variant="outlined"
        density="compact"
        label="Name"
        hide-details
        bg-color="bg-1"
      ></v-text-field>
      <div
        class="w-100 mt-4 rounded-lg d-flex justify-center align-center pointer"
        @click="handleSelectFile"
      >
        <div>
          <v-btn
            v-if="!fileImage"
            prepend-icon="mdi-camera"
            class="text-none"
            text="Image"
            variant="outlined"
          ></v-btn>
          <v-img
            :src="fileImage"
            style="max-width: 50vw; max-height: 50vh"
          ></v-img>
        </div>
      </div>
    </template>
  </CommonDialog>
  <v-file-input
    v-model.trim="file"
    id="file"
    style="display: none"
  ></v-file-input>
</template>

<script setup>
import Compressor from "compressorjs";
import { useStyleStore } from "~/stores/Style";

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const styleStore = useStyleStore();

const builderType = ref("");

const headers = ref(["Name", "Image", "Action"]);
const page = ref(1);
const size = ref(10);
const length = ref(10);

watch(
  () => builderType.value,
  (val) => {
    if (val) {
      page.value = 1;
      handleGetList();
    }
  }
);

watch(
  () => page.value,
  () => {
    handleGetList();
  }
);

const builderTypeID = computed(() => {
  return styleStore.listBuilderType.filter((item) => item.name)[0]?.id;
});

onMounted(() => {
  nextTick(() => {
    if (styleStore.listBuilderType.length === 0) handleGetList();
  });
});

const listValue = ref([]);
async function handleGetList() {
  const { data } = await useFetch(`${baseURL}/builder_value`, {
    method: "GET",
    params: {
      page: page.value - 1,
      size: size.value,
      builder_type_id: builderTypeID.value,
    },
  });
  if (!data.value) return;
  const { result, count, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    listValue.value = result;
    length.value = parseInt(count / size.value) + 1;
  }
}

const isShowCreate = ref(false);
const file = ref(null);
const fileImage = ref(null);
const name = ref("");

async function handleCreate() {
  const formData = new FormData();
  let image = null;
  new Compressor(file.value[0], {
    quality: 0.8,
    success(result) {
      image = new File([result], `${file.value[0].name}`);
      formData.append("image", image);
      formData.append("builder_type_id", builderTypeID.value);
      formData.append("name", name.value);
      handleCreateCallAPI(formData);
    },
    error(err) {
      console.log(err.message);
    },
  });
}

async function handleCreateCallAPI(formData) {
  const { data } = await useFetch(`${baseURL}/builder_value`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${getCookie("admin_token")}`,
    },
  });
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success(`Create ${name.value} successfully!`);
    handleReset();
    page.value = 1;
    handleGetList();
  }
}

function handleReset() {
  name.value = "";
  file.value = null;
  fileImage.value = null;
}

function handleSelectFile() {
  document.getElementById("file").click();
}

watch(
  () => file.value,
  () => {
    if (file.value) {
      const theReader = new FileReader();
      theReader.onloadend = async () => {
        fileImage.value = await theReader.result;
      };
      theReader.readAsDataURL(file.value[0]);
    }
  }
);

async function handleDelete(builderValue) {
  const { data } = await useFetch(
    `${baseURL}/builder_value/${builderValue.id}`,
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
    page.value = 1;
    handleGetList();
  }
}
</script>
