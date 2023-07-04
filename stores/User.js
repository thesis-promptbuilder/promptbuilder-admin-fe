import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    username: "",
    gmail: "",
    id: "",
    image_src: "",
    listUser: [],
    isLoadedListUser: false,
  }),
  getters: {},
  actions: {
    setUser(user) {
      this.username = user.username;
      this.gmail = user.gmail;
      this.id = user.id;
      this.image_src = user.image_src;
    },
    setListUser(listUser) {
      this.isLoadedListUser = true;
      this.listUser = listUser;
    },
    reset() {
      this.username = "";
      this.id = "";
      this.gmail = "";
    },
  },
});
