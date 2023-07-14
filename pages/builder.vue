<template>
  <div class="text-h5 font-weight-bold">
    <span class="text-primary-2">Builder</span> Management
  </div>
  <div class="d-flex mt-4">
    <v-btn
      text="Builder Type"
      class="text-none mr-2"
      :variant="type === 'BuilderType' ? 'elevated' : 'outlined'"
      :color="type === 'BuilderType' ? 'primary-2' : ''"
      @click="type = 'BuilderType'"
    ></v-btn>
    <v-btn
      text="Builder Value"
      class="text-none"
      :variant="type === 'BuilderValue' ? 'elevated' : 'outlined'"
      :color="type === 'BuilderValue' ? 'primary-2' : ''"
      @click="type = 'BuilderValue'"
    ></v-btn>
  </div>
  <div class="mt-4">
    <BuilderType v-if="type === 'BuilderType'"></BuilderType>
    <BuilderValue v-if="type === 'BuilderValue'"></BuilderValue>
  </div>
</template>

<script setup>
const type = ref("BuilderType");
</script>
