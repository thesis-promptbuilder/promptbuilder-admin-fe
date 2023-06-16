export function getCookie(name) {
  var cookieArr = document.cookie.split(";");

  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");

    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}

export const actions = [
  {
    name: "Edit",
    value: "edit",
    icon: "mdi-pencil",
    color: "info",
  },
  // {
  //   name: "Ban",
  //   value: "ban",
  //   icon: "mdi-cancel",
  //   color: "warning",
  // },
  {
    name: "Delete",
    value: "delete",
    icon: "mdi-delete",
    color: "error",
  },
];
