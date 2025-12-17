

export const getViewport = () => {

  return "mobile"
  return device.type === "mobile"
    ? "mobile"
    : "desktop";
};
