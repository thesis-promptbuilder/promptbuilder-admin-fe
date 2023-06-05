<template>
  <div style="position: relative" class="mb-4 pointer">
    <v-img :src="`https://${builderValue?.image_src}`" cover class="img" />
    <div
      class="d-flex align-center justify-space-between bg-bg-2 pa-2 px-4"
      style="border-radius: 0 0 5px 5px; height: 64px"
    >
      <div>{{ builderValue?.name }}</div>
      <v-btn
        variant="flat"
        color="error"
        text="Delete"
        class="text-text-1"
        :loading="isLoadingDelete"
        @click="handleDeleteBuilderValue"
      ></v-btn>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  builderValue: null,
});
const config = useRuntimeConfig();

const emit = defineEmits(["deleteBuilderValue"]);

const isLoadingDelete = ref(false);
async function handleDeleteBuilderValue() {
  isLoadingDelete.value = true;
  const { data } = await useLazyFetch(
    `${config.public.baseURL}/builder_value/${props?.builderValue?.id}`,
    {
      method: "DELETE",
    }
  );
  const { result, code, msg } = data.value;
  isLoadingDelete.value = false;
  if (code === CODE_SUCCESS) {
    emit("deleteBuilderValue");
  }
}
</script>

<style scoped>
.img:hover {
  opacity: 0.8;
}
</style>
