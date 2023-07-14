import { defineStore } from "pinia";

export const useStyleStore = defineStore("styleStore", {
  state: () => ({
    listBuilderType: [],
  }),
  actions: {
    setListBuilderType(items) {
      this.listBuilderType = items;
    },
  },
});
