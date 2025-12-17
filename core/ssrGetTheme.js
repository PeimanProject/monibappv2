import { defaultTheme, themeList } from "@/data/themeList/themeList";
import _ from "lodash";

export const SSR_GetTheme = async () => {
  // const res = await fetch(`${API().core}auth/info`, {
  //   method: "GET",
  //   headers: await getHeaders(),
  // });

  // const responsive = await res.json();

  // const { taskbarPosition, fontFamily } = responsive?.profile || {
  //   taskbarPosition: "top",
  //   fontFamily: "roboto",
  // };

  const theme = defaultTheme;

  if (!!theme?.theme?.themeId) {
    theme.theme = _.find(
      themeList,
      (th) => th.themeId === theme?.theme?.themeId
    );
  }

  theme.theme.fontFamily = "iranSans";

  return theme;
};
