<template>
  <div class="text-h5 font-weight-bold">
    <span class="text-primary-2">Image</span> Management
  </div>
  <div class="d-flex flex-wrap mt-4">
    <div
      v-for="(image, index) in listImages"
      :key="index"
      class="pa-2 pointer w-25 img"
    >
      <div style="position: relative">
        <v-img :src="`${image.image_src}`" cover></v-img>
        <v-btn
          icon="mdi-delete"
          color="error"
          style="position: absolute; top: 2px; right: 2px"
          variant="text"
          @click.stop="
            isShowDeleteDialog = true;
            selectedImage = image;
          "
        ></v-btn>
      </div>
    </div>
    <div v-if="isLoadingImage" class="d-flex justify-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
  </div>
  <v-dialog v-model.trim="isShowDeleteDialog" width="auto" persistent>
    <v-card>
      <v-card-text>
        <div class="text-h6 font-weight-bold">
          <span class="text-error">Delete</span>
        </div>
        <div>Are you sure to delete this prompt?</div>
        <v-img
          class="mt-4"
          :src="`${selectedImage?.image_src}`"
          style="max-width: 30vw; max-height: 50vh"
        ></v-img>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="isShowDeleteDialog = false">Cancel</v-btn>
        <v-btn variant="flat" color="error" @click="handleDeletePrompt">
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useUserStore } from "~/stores/User";

const userStore = useUserStore();

const config = useRuntimeConfig();
const baseURL = `${config.public.baseURL}`;

const page = ref(0);
const size = ref(20);
const isLoadingImage = ref(false);
const listImages = ref([]);
const notLoad = ref(false);

onMounted(() => {
  nextTick(() => {
    handleGetListImage();
  });
});

async function handleGetListImage() {
  isLoadingImage.value = true;
  const { data } = await useFetch(`${baseURL}/image`, {
    method: "GET",
    query: {
      page: page.value,
      size: size.value,
    },
  });
  isLoadingImage.value = false;
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    if (result.length === 0) {
      notLoad.value = true;
      return;
    }
    listImages.value.push(...result);
  }
}

onMounted(() => {
  function handleScroll() {
    if (notLoad.value) return;
    if (
      document?.documentElement?.clientHeight + window?.scrollY >=
      document?.documentElement?.scrollHeight
    ) {
      page.value += 1;
      handleGetListImage();
    }
  }
  window?.addEventListener("scroll", handleScroll);
});

const isShowDeleteDialog = ref(false);
const selectedImage = ref(null);

async function handleDeletePrompt() {
  const { data } = await useFetch(
    `${baseURL}/image/${selectedImage.value?.id}`,
    {
      method: "DELETE",
      params: {
        user_id: userStore.id,
      },
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    }
  );
  if (!data.value) return;
  const { result, code, msg } = data.value;
  if (code === CODE_SUCCESS) {
    isShowDeleteDialog.value = false;
    useNuxtApp().$toast.success("Delete successfully!");
    listImages.value = [];
    page.value = 0;
    handleGetListImage();
  }
}
</script>
