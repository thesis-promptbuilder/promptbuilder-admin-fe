<template>
  <div class="d-flex justify-space-between align-center" v-if="parentName">
    <v-btn
      :text="`Delete ${parentName}`"
      color="error"
      size="large"
      class="text-text-1 font-weight-bold"
      @click="showDeleteDialog = true"
    >
      Delete {{ parentName }}</v-btn
    >
    <v-text-field
      class="mx-8"
      density="comfortable"
      variant="outlined"
      hide-details
      prepend-inner-icon="mdi-magnify"
      placeholder="Search builder value"
    ></v-text-field>
    <v-btn
      :text="`Create new value of ${parentName}`"
      color="info"
      size="large"
      @click="showDialog = true"
    ></v-btn>
  </div>
  <div class="mt-4 d-flex">
    <div class="w-25 mr-2">
      <div
        v-for="(image, index) in listImageBuilderValue0"
        :key="`${index}_image_col0`"
      >
        <BuilderImage
          :builder-value="image"
          @delete-builder-value="handleGetBuilderValue(parentName)"
        />
      </div>
    </div>
    <div class="w-25 mr-2">
      <div
        v-for="(image, index) in listImageBuilderValue1"
        :key="`${index}_image_col1`"
      >
        <BuilderImage
          :builder-value="image"
          @delete-builder-value="handleGetBuilderValue(parentName)"
        />
      </div>
    </div>
    <div class="w-25 mr-2">
      <div
        v-for="(image, index) in listImageBuilderValue2"
        :key="`${index}_image_col2`"
      >
        <BuilderImage
          :builder-value="image"
          @delete-builder-value="handleGetBuilderValue(parentName)"
        />
      </div>
    </div>
    <div class="w-25 mr-2">
      <div
        v-for="(image, index) in listImageBuilderValue3"
        :key="`${index}_image_col3`"
      >
        <BuilderImage
          :builder-value="image"
          @delete-builder-value="handleGetBuilderValue(parentName)"
        />
      </div>
    </div>
  </div>
  <v-dialog v-model="showDialog" width="500px" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">{{ parentName }}</div>
        <v-text-field
          v-model="newBuilderValue"
          class="mt-4"
          variant="outlined"
          density="comfortable"
          hide-details
          bg-color="bg-2"
          placeholder="Builder Value"
        ></v-text-field>
        <v-file-input
          v-model="newBuilderValueImage"
          variant="outlined"
          density="comfortable"
          hide-details
          bg-color="bg-2"
          class="mt-4"
          prepend-icon="mdi-camera"
          label="Image describe builder value"
        ></v-file-input>
      </v-card-text>
      <v-card-actions class="d-flex justify-end mr-4 mb-2">
        <v-btn variant="text" @click="showDialog = false">Cancel</v-btn>
        <v-btn
          variant="flat"
          color="info"
          @click="handleCreateBuilderValue"
          :loading="isLoadingCreate"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showDeleteDialog" width="300px" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">
          <span class="text-error">Delete </span>
        </div>
        <div>
          Are you sure to delete "<span class="font-weight-bold">{{
            parentName
          }}</span
          >"?
        </div>
      </v-card-text>
      <v-card-actions class="d-flex justify-end mr-4 mb-2">
        <v-btn variant="text" @click="showDeleteDialog = false">Cancel</v-btn>
        <v-btn
          variant="flat"
          color="error"
          :loading="isLoadingDelete"
          @click="handleDeleteBuilderType"
        >
          Delete
        </v-btn>
      </v-card-actions></v-card
    >
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  parentName: String,
});

import { useStyleStore } from "~/stores/Style";

const styleStore = useStyleStore();

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/builder_value`;
const showDialog = ref(false);
const isLoadingCreate = ref(false);
const newBuilderValue = ref("");
const newBuilderValueImage = ref(null);

async function handleCreateBuilderValue() {
  isLoadingCreate.value = true;
  const formData = new FormData();
  formData.append("image", newBuilderValueImage.value[0]);
  const { data } = await useLazyFetch(baseURL, {
    method: "POST",
    params: {
      parent_name: props.parentName,
      name: newBuilderValue.value,
    },
    body: formData,
  });
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    newBuilderValue.value = "";
    newBuilderValueImage.value = null;
    showDialog.value = false;
    handleGetBuilderValue(props.parentName);
  }
  isLoadingCreate.value = false;
}

async function handleGetBuilderValue(builderType) {
  const { data } = await useLazyFetch(baseURL, {
    method: "GET",
    params: {
      page: 0,
      size: 1000,
      builder_type_name: builderType,
    },
  });
  const { result, code, msg } = data?.value;
  if (code === CODE_SUCCESS) {
    styleStore.setListBuilderValue(builderType, result);
  }
  getListImageByModule();
}

function getListImageBuilderValue(items, colNumber) {
  if (!items) return;
  return items.filter((image, index) => {
    if (index % 4 === colNumber) {
      return image;
    }
  });
}

function getListImageByModule() {
  const listBuilderValue = styleStore.listBuilderValue[props?.parentName];
  listImageBuilderValue0.value = getListImageBuilderValue(listBuilderValue, 0);
  listImageBuilderValue1.value = getListImageBuilderValue(listBuilderValue, 1);
  listImageBuilderValue2.value = getListImageBuilderValue(listBuilderValue, 2);
  listImageBuilderValue3.value = getListImageBuilderValue(listBuilderValue, 3);
}

const listImageBuilderValue0 = ref([]);
const listImageBuilderValue1 = ref([]);
const listImageBuilderValue2 = ref([]);
const listImageBuilderValue3 = ref([]);

watch(
  () => props.parentName,
  () => {
    if (!styleStore.listBuilderValue[props.parentName]) {
      handleGetBuilderValue(props?.parentName);
    }
    getListImageByModule();
  }
);

const showDeleteDialog = ref(false);
const isLoadingDelete = ref(false);

const emit = defineEmits(["deleteBuilderType"]);

async function handleDeleteBuilderType() {
  const builderTypeID = styleStore.listBuilderType.filter(
    (item) => item.name === props.parentName
  )[0]?.id;
  if (!builderTypeID) return;
  isLoadingDelete.value = true;
  const { data } = await useLazyFetch(
    `${config.public.baseURL}/builder_type/${builderTypeID}`,
    {
      method: "DELETE",
    }
  );
  const { result, code, msg } = data.value;
  if (code == CODE_SUCCESS) {
    showDeleteDialog.value = false;
    emit("deleteBuilderType");
  }
  isLoadingDelete.value = false;
}
</script>
