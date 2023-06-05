<template>
  <div class="text-h3 font-weight-bold">
    Admin <span class="text-primary-2">PromptBuilder</span>
  </div>
  <div class="mt-2 text-h6">Create best prompts with suggestions</div>
  <div
    class="mt-4 rounded-lg bg-bg-1 pa-2 d-flex"
    style="max-height: calc(100vh - 300px)"
  >
    <div class="w-25 pa-2 ma-1 el-prompt rounded-lg">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          :variant="suggestButton === 'Image Link' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'Image Link' ? 'primary-2' : ''"
          text="Image link"
          prepend-icon="mdi-link-variant"
          @click="suggestButton = 'Image Link'"
        ></v-btn>
        <v-btn variant="flat" size="small" color="info" icon="mdi-plus">
        </v-btn>
      </div>
    </div>
    <div class="w-25 pa-2 ma-1 el-prompt rounded-lg">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          :variant="suggestButton === 'Text' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'Text' ? 'primary-2' : ''"
          text="Text"
          prepend-icon="mdi-text"
          @click="suggestButton = 'Text'"
        ></v-btn>
        <v-btn variant="flat" size="small" color="info" icon="mdi-plus">
        </v-btn>
      </div>
    </div>
    <div class="w-25 pa-2 ma-1 el-prompt rounded-lg">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          :variant="suggestButton === 'Style' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'Style' ? 'primary-2' : ''"
          text="Style"
          prepend-icon="mdi-palette-outline"
          @click="suggestButton = 'Style'"
        ></v-btn>
      </div>
      <v-autocomplete
        v-if="suggestButton === 'Style'"
        v-model="selectedBuilderTypeStyle"
        :items="styleStore.listBuilderType.map((item) => item.name).sort()"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-4"
        bg-color="bg-2"
      >
        <template #append-item>
          <div class="pa-2">
            <v-btn
              text="Create"
              variant="flat"
              color="info"
              class="w-100"
              @click="showDialog = true"
            >
            </v-btn>
          </div>
        </template>
      </v-autocomplete>
    </div>
    <div class="w-25 pa-2 ma-1 el-prompt rounded-lg">
      <div class="d-flex justify-space-between align-center">
        <v-btn
          :variant="suggestButton === 'Param' ? 'elevated' : 'outlined'"
          :color="suggestButton === 'Param' ? 'primary-2' : ''"
          text="Param"
          prepend-icon="mdi-wrench-cog-outline"
          @click="suggestButton = 'Param'"
        ></v-btn>
      </div>
      <v-autocomplete
        v-if="suggestButton === 'Param'"
        v-model="selectedBuilderTypeParam"
        :items="paramStore.listBuilderType.map((item) => item.name).sort()"
        variant="outlined"
        density="compact"
        hide-details
        class="mt-4"
        bg-color="bg-2"
      >
        <template #append-item>
          <div class="pa-2">
            <v-btn
              text="Create"
              variant="flat"
              color="info"
              class="w-100"
              @click="showDialog = true"
            >
            </v-btn>
          </div>
        </template>
        <template v-slot:selection="{ item }">
          <span>{{ item.title }}</span>
          <span>&nbsp;</span>
          <span class="text-text-2">
            {{
              paramStore.listBuilderType.filter((i) => i.name === item.title)
                .length
                ? paramStore.listBuilderType.filter(
                    (i) => i.name === item.title
                  )[0].short_name
                : ""
            }}
          </span>
        </template>
      </v-autocomplete>
    </div>
  </div>
  <div class="mt-2 rounded-lg bg-bg-1 pa-4">
    <BuilderStyle
      v-if="suggestButton === 'Style'"
      :parent-name="selectedBuilderTypeStyle"
      @delete-builder-type="
        selectedBuilderTypeStyle = '';
        handleGetBuilderTypeStyle();
      "
    ></BuilderStyle>
    <BuilderParam v-if="suggestButton === 'Param'"></BuilderParam>
  </div>
  <v-dialog v-model="showDialog" width="500px" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6">{{ suggestButton }}</div>
        <v-text-field
          v-model="newBuilderType"
          variant="outlined"
          density="comfortable"
          hide-details
          bg-color="bg-2"
        ></v-text-field>
        <div class="text-h6 mt-4" v-if="suggestButton === 'Param'">
          Short name
        </div>
        <v-text-field
          v-if="suggestButton === 'Param'"
          v-model="newShortName"
          variant="outlined"
          density="comfortable"
          hide-details
          bg-color="bg-2"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="d-flex justify-end mr-4 mb-2">
        <v-btn
          variant="text"
          @click="
            showDialog = false;
            newBuilderType = '';
            newShortName = '';
          "
        >
          Cancel
        </v-btn>
        <v-btn
          variant="flat"
          color="info"
          @click="handleCreateBuilderType"
          :loading="isLoadingCreate"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useStyleStore } from "~/stores/Style";
const styleStore = useStyleStore();
import { useParamStore } from "~/stores/Param";
const paramStore = useParamStore();

const suggestButton = ref("Style");
const showDialog = ref(false);
const newBuilderType = ref("");
const newShortName = ref("");

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}/builder_type`;

const isLoadingCreate = ref(false);

async function handleCreateBuilderType() {
  isLoadingCreate.value = true;
  const { data } = await useFetch(baseURL, {
    method: "POST",
    body: {
      parent_type: suggestButton.value,
      name: newBuilderType.value,
      short_name: newShortName.value,
    },
  });
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    showDialog.value = false;
    newBuilderType.value = "";
    newShortName.value = "";
    isLoadingCreate.value = false;

    if (suggestButton.value === "Style") {
      handleGetBuilderTypeStyle();
    }
    if (suggestButton.value === "Param") {
      handleGetBuilderTypeParam();
    }
  }
}

async function handleGetBuilderTypeStyle() {
  const { data } = await useFetch(baseURL, {
    method: "GET",
    params: {
      page: 0,
      size: 100,
      parent_type: "Style",
    },
  });
  const { result, code, msg } = data.value;
  if (code == CODE_SUCCESS) {
    styleStore.setListBuilderType(result);
  }
}

const selectedBuilderTypeStyle = ref("");

async function handleGetBuilderTypeParam() {
  const { data } = await useFetch(baseURL, {
    method: "GET",
    params: {
      page: 0,
      size: 100,
      parent_type: "Param",
    },
  });
  const { result, code, msg } = data.value;
  if (code == CODE_SUCCESS) {
    paramStore.setListBuilderType(result);
  }
}

const selectedBuilderTypeParam = ref("");

onMounted(() => {
  nextTick(() => {
    if (!styleStore.isLoadedBuilderType) {
      handleGetBuilderTypeStyle();
    }
    if (!paramStore.isLoadedBuilderType) {
      handleGetBuilderTypeParam();
    }
  });
});

watch(
  () => suggestButton.value,
  () => {
    selectedBuilderTypeStyle.value = "";
  }
);
</script>

<style scoped>
.el-prompt {
  border: 1px solid black;
  height: 100%;
  overflow: hidden;
}
.el-list {
  max-height: calc(100vh - 400px);
  overflow-y: scroll;
}
</style>
