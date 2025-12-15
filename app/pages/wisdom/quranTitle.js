"use client";

import { Box } from "@mui/material";
import { TabNormalItem, TabStyle } from "@/app/component/tabStyle";
import { useTranslations } from "next-intl";

// const Key = ({ children, subItem, selected, onClick }) => {
//   return (
//     <ButtonBase
//       onClick={onClick}
//       sx={{
//         flex: 1,
//         height: 1 / 1,
//         flexDirection: "column",
//         transition: (theme) => theme.transitions.create("all"),
//         ...(selected && {
//           bgcolor: "#79998c",
//           color: "white",
//           borderRadius: (theme) => theme.spacing(1, 1, 0, 0),
//         }),
//       }}
//     >
//       <Typography variant="body1">{children}</Typography>
//       {subItem && <Typography variant="caption">{subItem}</Typography>}
//     </ButtonBase>
//   );
// };

export const QuranTitle = ({ value, onChange, rId }) => {
  const t = useTranslations("Series");
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 1,
      }}
    >
      <TabStyle
        index={
          value === "quran"
            ? 1
            : value === "lecture" || value === "default"
            ? 0
            : 2
        }
      >
        <TabNormalItem
          text={t("Lecture")}
          value={"lecture"}
          index={1}
          selected={value === "lecture" || value === "default"}
          onChange={onChange}
        />
        <TabNormalItem
          text={t("Verse")}
          value={"quran"}
          index={0}
          selected={value === "quran"}
          onChange={onChange}
        />
        {rId < 17 && <TabNormalItem
          text={t("Mishkat")}
          value={"miskat"}
          index={2}
          selected={value === "miskat"}
          onChange={onChange}
        />}
      </TabStyle>
    </Box>

    // <Box
    //   sx={{
    //     pt: 1,
    //     bgcolor: "#bccac4",
    //     position: "sticky",
    //     top: desktopValues({}).APP_HEIGHT,
    //     zIndex: 22,
    //   }}
    // >
    //   <Box
    //     sx={{
    //       height: 62,
    //       bgcolor: "background.default",
    //       display: "flex",

    //       borderRadius: (theme) => theme.spacing(1, 1, 0, 0),

    //       borderBottom: (theme) => `1px solid ${theme.palette.primary.main}`,
    //     }}
    //   >
    //     <Key selected={value === "quran"} onClick={onChange("quran")}>
    //       آیات
    //     </Key>
    //     <Key selected={value === "lecture" || value === "default"} onClick={onChange("lecture")}>
    //       جلسات
    //     </Key>
    //     {rId < 17 && <Key
    //       selected={value === "miskat"}
    //       onClick={onChange("miskat")}
    //       subItem={"(مشکات)"}
    //     >
    //       تفسیر مکتوب
    //     </Key>}
    //   </Box>
    // </Box>
  );
};
