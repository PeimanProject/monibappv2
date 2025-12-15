export const getDirection = (locale) => {
  switch (locale) {
    case "fa":
      return "rtl";
    case "ar":
      return "rtl";
    default:
      return "ltr";
  }
};
