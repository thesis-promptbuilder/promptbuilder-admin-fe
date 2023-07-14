<template>
  <v-dialog width="auto" persistent="">
    <v-card>
      <v-card-text style="min-width: 30vw">
        <div class="text-h6 font-weight-bold">
          <span :class="textClass">{{ title }}</span>
        </div>
        <div class="mb-4">
          {{ content }}
        </div>
        <slot name="customSlot"></slot>
      </v-card-text>
      <v-card-actions class="d-flex justify-end">
        <v-btn variant="text" @click="handleClose"> Cancel </v-btn>
        <v-btn variant="flat" :color="type" @click="handleConfirm">
          {{ buttonConfirm }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  title: "",
  type: "info",
  content: "",
  buttonConfirm: "Add",
});

const emit = defineEmits(["handleConfirm", "handleClose"]);

function handleClose() {
  emit("handleClose");
}

function handleConfirm() {
  emit("handleConfirm");
}

const textClass = computed(() => {
  return `text-${props.type}`;
});
</script>
