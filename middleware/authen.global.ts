import { useUserStore } from "~/stores/User";

export default defineNuxtRouteMiddleware((to, from) => {
  // console.log("init middleware", process.client);
  if (process.client) {
    const isLogin = getCookie("admin_token");
    const expiredTime = getCookie("admin_expire");

    if (to.fullPath === "/") return navigateTo("/user");

    if (!isLogin || (isLogin && checkIsExpired(expiredTime))) {
      if (to.fullPath === "/login") return;
      return navigateTo("/login");
    } else {
      if (to.fullPath === "/login") {
        return navigateTo("/");
      }
      const userStore = useUserStore();
      const decoded_info = decodeJwt(isLogin);
      userStore.setUser(decoded_info);
    }
  }
});

function checkIsExpired(expiredTime: any) {
  if (!expiredTime) return false;
  if (expiredTime < Date.now() / 1000) return true;
  return false;
}

function decodeJwt(token: any) {
  var base64Payload = token.split(".")[1];
  var payload = decodeURIComponent(
    atob(base64Payload)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(payload);
}
