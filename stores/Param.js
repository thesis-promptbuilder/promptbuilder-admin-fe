import { defineStore } from "pinia";

export const useParamStore = defineStore("paramStore", {
  state: () => ({
    listBuilderType: [],
    isLoadedBuilderType: false,
    listBuilderValue: {},
  }),
  getters: {},
  actions: {
    setListBuilderType(items) {
      this.isLoadedBuilderType = true;
      this.listBuilderType = items;
    },
    setListBuilderValue(builderType, items) {
      if (!builderType) return;
      this.listBuilderValue[builderType] = items;
    },
  },
});
