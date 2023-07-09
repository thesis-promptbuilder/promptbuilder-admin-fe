<template>
  <div class="text-h5 font-weight-bold">
    <span class="text-primary-2">Builder</span> Management
  </div>
  <div class="mt-4">
    <div class="d-flex align-center w-75">
      <v-select
        v-model="parentType"
        :items="listParentType.map((item) => item.name).sort()"
        variant="outlined"
        density="compact"
        bg-color="bg-1"
        hide-details
      ></v-select>
      <span class="mx-2">-</span>
      <v-select
        v-if="!isLoadingGetBuilderType"
        v-model="builderTypeName"
        :items="styleStore.listBuilderType.map((item) => item.name).sort()"
        variant="outlined"
        density="compact"
        bg-color="bg-1"
        hide-details
      >
        <template #prepend-item>
          <div class="d-flex align-center justify-center pb-2 px-2">
            <v-btn
              text="New builder type"
              variant="flat"
              color="info"
              prepend-icon="mdi-plus"
              @click="isShowCreateBuilderType = true"
            ></v-btn>
          </div>
        </template>
      </v-select>
      <v-btn
        class="ml-2"
        variant="flat"
        color="error"
        prepend-icon="mdi-delete"
        text="Delete"
        @click="isShowDeleteBuilderType = true"
      ></v-btn>
    </div>
    <div class="mt-4">
      <div v-if="isLoadingGetBuilderValue" class="d-flex justify-center">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
      <div v-else>
        <v-table class="bg-bg-1" fixed-header height="75vh">
          <thead>
            <tr>
              <th
                v-for="(header, idx) in headers"
                :key="idx"
                :class="header === 'Image' ? 'text-center' : 'text-left'"
              >
                <v-btn
                  v-if="header === 'Action'"
                  prepend-icon="mdi-plus"
                  variant="flat"
                  color="info"
                  text="New builder value"
                  @click="isShowCreateBuilderValue = true"
                ></v-btn>
                <span v-else>{{ header }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="builderValue in styleStore.listBuilderValue[
                builderTypeName
              ]"
              :key="builderValue?.id"
            >
              <td>{{ builderValue.name }}</td>
              <td class="d-flex justify-center pa-2" style="height: 250px">
                <v-img :src="`${builderValue.image_src}`"></v-img>
              </td>
              <td>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" variant="outlined"> Action </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(action, index) in actions"
                      :key="index"
                    >
                      <v-btn
                        class="text-none"
                        :text="action.name"
                        :color="action.color"
                        :prepend-icon="action.icon"
                        block
                        :loading="
                          action.value === 'delete'
                            ? isLoadingDeleteBuilderValue
                            : false
                        "
                        @click="handleAction(action, builderValue)"
                      >
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </td>
            </tr>
          </tbody>
        </v-table>
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
    </div>
  </div>
  <v-dialog v-model="isShowCreateBuilderValue" width="auto" persistent>
    <v-card>
      <v-card-text style="min-width: 30vw">
        <div class="text-h6 font-weight-bold">
          <span class="text-info">Create builder value</span>
        </div>
        <v-text-field
          v-model.trim="builderTypeName"
          readonly
          class="mt-4"
          variant="outlined"
          density="compact"
          hide-details
          bg-color="bg-3"
        ></v-text-field>
        <v-text-field
          v-model.trim="builderValueName"
          autofocus=""
          class="mt-4"
          variant="outlined"
          density="compact"
          label="Name"
          hide-details
          bg-color="bg-1"
          @keydown.prevent.enter="handlePreprocessing"
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
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          variant="text"
          @click="
            builderValueName = '';
            isShowCreateBuilderValue = false;
            file = null;
            fileImage = null;
          "
        >
          Cancel
        </v-btn>
        <v-btn
          variant="flat"
          color="info"
          :loading="isLoadingCreateBuilderValue"
          @click="handlePreprocessing"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowUpdateBuilderValue" width="auto" persistent>
    <v-card>
      <v-card-text style="min-width: 30vw">
        <div class="text-h6 font-weight-bold">
          <span class="text-info">Update builder value</span>
        </div>
        <v-text-field
          v-model.trim="builderTypeName"
          readonly
          class="mt-4"
          variant="outlined"
          density="compact"
          hide-details
          bg-color="bg-3"
        ></v-text-field>
        <v-text-field
          v-model.trim="builderValueNameUpdate"
          autofocus=""
          class="mt-4"
          variant="outlined"
          density="compact"
          label="Name"
          hide-details
          bg-color="bg-1"
          @keydown.prevent.enter="handleUpdateBuilderValue"
        ></v-text-field>
        <div
          class="w-100 mt-4 rounded-lg d-flex justify-center align-center pointer"
        >
          <v-img
            :src="`${selectedBuilderValue.image_src}`"
            style="max-width: 50vw; max-height: 50vh"
          ></v-img>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="isShowUpdateBuilderValue = false">
          Cancel
        </v-btn>
        <v-btn variant="flat" color="info" @click="handleUpdateBuilderValue">
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowCreateBuilderType" width="auto" persistent="">
    <v-card>
      <v-card-text style="min-width: 30vw">
        <div class="text-h6 font-weight-bold">
          <span class="text-info">Create builder type</span>
        </div>
        <v-text-field
          v-model.trim="parentType"
          autofocus
          class="mt-4"
          variant="outlined"
          density="compact"
          label="Parent Type"
          readonly
          bg-color="bg-3"
          hide-details
        ></v-text-field>
        <v-text-field
          v-model.trim="builderTypeNewName"
          autofocus
          class="mt-4"
          variant="outlined"
          density="compact"
          label="Name"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn
          variant="text"
          @click="
            builderTypeNewName = '';
            isShowCreateBuilderType = false;
          "
        >
          Cancel
        </v-btn>
        <v-btn
          variant="flat"
          color="info"
          :loading="isLoadingCreateBuilderType"
          @click="handleCreateBuilderType"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isShowDeleteBuilderType" width="auto" persistent="">
    <v-card>
      <v-card-text style="min-width: 30vw">
        <div class="text-h6 font-weight-bold">
          <span class="text-error">Delete builder type</span>
        </div>
        <div>
          Are you sure to delete
          <span class="font-weight-bold">{{ builderTypeName }}</span
          >?
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="isShowDeleteBuilderType = false">
          Cancel
        </v-btn>
        <v-btn variant="flat" color="error" @click="handleDeleteBuilderType">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-file-input
    v-model.trim="file"
    id="file"
    style="display: none"
  ></v-file-input>
</template>

<script setup>
import { useStyleStore } from "~/stores/Style";
import { actions } from "~/utils/common";
import Compressor from "compressorjs";

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const styleStore = useStyleStore();

const listParentType = ref([
  { name: "Artists", icon: "mdi-brush-outline" },
  { name: "Camera, Film And Lenses", icon: "mdi-camera-outline" },
  { name: "Colors", icon: "mdi-palette-outline" },
  { name: "Design Styles", icon: "mdi-pencil-ruler" },
  { name: "Digital", icon: "mdi-television" },
  { name: "Lighting", icon: "mdi-lightbulb-outline" },
  { name: "Themes", icon: "mdi-theme-light-dark" },
]);
const parentType = ref("");

const builderTypeName = ref("");

const isLoadingGetBuilderType = ref(false);
async function handleGetBuilderType() {
  isLoadingGetBuilderType.value = true;
  const { data } = await useFetch(`${baseURL}/builder_type`, {
    method: "GET",
    params: {
      page: 0,
      size: 100,
      parent: parentType.value,
    },
  });
  isLoadingGetBuilderType.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    styleStore.setListBuilderType(result);
  }
}

watch(
  () => parentType.value,
  () => {
    handleGetBuilderType();
  }
);

const isShowDeleteBuilderType = ref(false);
async function handleDeleteBuilderType() {
  const builderTypeId = styleStore.listBuilderType.filter(
    (item) => item.name === builderTypeName.value
  )[0]["id"];
  isLoadingGetBuilderType.value = true;
  const { data } = await useFetch(`${baseURL}/builder_type/${builderTypeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getCookie("admin_token")}`,
    },
  });
  isLoadingGetBuilderType.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Delete successfully!");
    isShowDeleteBuilderType.value = false;
    handleGetBuilderType();
  }
}

const isShowCreateBuilderType = ref(false);
const isLoadingCreateBuilderType = ref(false);
const builderTypeNewName = ref("");

async function handleCreateBuilderType() {
  isLoadingCreateBuilderType.value = true;
  const { data } = await useFetch(`${baseURL}/builder_type`, {
    method: "POST",
    body: {
      parent: parentType.value,
      name: builderTypeNewName.value,
    },
    headers: {
      Authorization: `Bearer ${getCookie("admin_token")}`,
    },
  });
  isLoadingCreateBuilderType.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success(
      `Create ${builderTypeNewName.value} successfully!`
    );
    builderTypeNewName.value = "";
    handleGetBuilderType();
  }
}

const page = ref(1);
const size = ref(10);
const headers = ref(["Name", "Image", "Action"]);

const length = ref(10);

const isLoadingGetBuilderValue = ref(false);
async function handleGetBuilderValue() {
  isLoadingGetBuilderValue.value = true;
  const { data } = await useFetch(`${baseURL}/admin/builder_value`, {
    method: "GET",
    params: {
      page: page.value - 1,
      size: size.value,
      builder_type: builderTypeName.value,
    },
  });
  isLoadingGetBuilderValue.value = false;
  if (!data.value) return;
  const { result, count, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    styleStore.setListBuilderValue(builderTypeName.value, result);
    length.value = parseInt(count / size.value) + 1;
  }
}

const isShowCreateBuilderValue = ref(false);
const isLoadingCreateBuilderValue = ref(false);
const builderValueName = ref("");

function handlePreprocessing() {
  isLoadingCreateBuilderValue.value = true;

  const formData = new FormData();
  let image = null;
  new Compressor(file.value[0], {
    quality: 0.8,
    success(result) {
      image = new File([result], `${file.value[0].name}`);
      formData.append("image", image);
      formData.append("parent", builderTypeName.value);
      formData.append("name", builderValueName.value);
      handleCreateBuilderValue(formData);
    },
    error(err) {
      console.log(err.message);
    },
  });
}

async function handleCreateBuilderValue(formData) {
  const { data } = await useFetch(`${baseURL}/builder_value`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${getCookie("admin_token")}`,
    },
  });
  isLoadingCreateBuilderValue.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success(
      `Create ${builderValueName.value} successfully!`
    );
    builderValueName.value = "";
    file.value = null;
    fileImage.value = null;
    handleGetBuilderValue();
  }
}

const selectedBuilderValue = ref(null);
function handleAction(action, builderValue) {
  selectedBuilderValue.value = builderValue;
  const builderValueId = builderValue.id;
  if (action.value === "edit") {
    builderValueNameUpdate.value = builderValue.name;
    isShowUpdateBuilderValue.value = true;
  }
  if (action.value === "delete") {
    handleDeleteBuilderValue(builderValueId);
  }
}

const isShowUpdateBuilderValue = ref(false);
const builderValueNameUpdate = ref("");
async function handleUpdateBuilderValue() {
  const { data } = await useFetch(
    `${baseURL}/builder_value/${selectedBuilderValue.value.id}`,
    {
      method: "PUT",
      body: {
        name: builderValueNameUpdate.value,
      },
      headers: {
        Authorization: `Bearer ${getCookie("admin_token")}`,
      },
    }
  );
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    isShowUpdateBuilderValue.value = false;
    useNuxtApp().$toast.success("Update successfully!");
    handleGetBuilderValue();
  }
}

const isLoadingDeleteBuilderValue = ref(false);
async function handleDeleteBuilderValue(builderValueId) {
  isLoadingDeleteBuilderValue.value = true;
  const { data } = await useFetch(
    `${baseURL}/builder_value/${builderValueId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("admin_token")}`,
      },
    }
  );
  isLoadingDeleteBuilderValue.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    useNuxtApp().$toast.success("Delete successfully!");
    page.value = 1;
    handleGetBuilderValue();
  }
}

const file = ref(null);
const fileImage = ref(null);
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

watch(
  () => builderTypeName.value,
  () => {
    page.value = 1;
    handleGetBuilderValue();
  }
);

watch(
  () => page.value,
  () => {
    handleGetBuilderValue();
  }
);
</script>
