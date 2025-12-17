import React from "react";
import DeviceIcon from "@mui/icons-material/Computer";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import _ from "lodash";
import { Typography, Slider, Box } from "@mui/material";
import { useThemeModeStore } from "@/store/layout/useThemeModeStore";
import { useQuranFontSizeStore } from "@/store/layout/useQuranFontSizeStore";
import { useTranslateFontSizeStore } from "@/store/layout/useTranslateFontSizeStore";
import { TabCircleItem, TabStyle } from "@/app/component/tabStyle";

const sizeSettingMarks = (get) => [
  {
    value: 0,
    shade: 300,
    label: get("Menu.small"),
  },
  {
    value: 50,
    shade: 500,
    label: get("Menu.normal"),
  },
  {
    value: 100,
    shade: 700,
    label: get("Menu.large"),
  },
];

const modeList = [
  {
    type: "device",
    icon: <DeviceIcon />,
  },
  {
    type: "light",
    icon: <LightModeIcon />,
  },
  {
    type: "dark",
    icon: <DarkModeIcon />,
  },
];

const Index = {
  device: 0,
  light: 1,
  dark: 2,
};

export const SettingData = [
  {
    id: "mode",
    render: ({ }) => {
      const { setMode, mode } = useThemeModeStore((state) => state);
      return (
        <TabStyle style="circle" index={Index[mode]}>
          {_.map(modeList, (theme, index) => (
            <TabCircleItem
              key={theme.type}
              value={theme.type}
              index={index}
              onChange={() => () => setMode(theme.type)}
            // color={theme.type === mode ? "dark" : "normal"}
            // ctrIcon={theme.icon}
            // title={t(theme.type)}
            >
              {theme.icon}
            </TabCircleItem>
          ))}
        </TabStyle>
      );
    },
  },
  // ..._.map(modeList, (theme) => ({
  //   id: theme.type,
  //   render: ({ t }) => {
  //     const { setMode, mode } = useThemeModeStore((state) => state);
  //     return (
  //       <MenuItem
  //         onChange={() => setMode(theme.type)}
  //         color={theme.type === mode ? "dark" : "normal"}
  //         ctrIcon={theme.icon}
  //         title={t(theme.type)}
  //       />
  //     );
  //   },
  // })),
  {
    id: "size1",
    render: ({ get }) => {
      const { setQuranFontSize, quranFontSize } = useQuranFontSizeStore(
        (state) => state
      );

      const handleChangeQuranSize = React.useCallback(
        (_e, value) => setQuranFontSize(value),
        [setQuranFontSize]
      );

      return (
        <Box sx={{ flex: 1, mt: 2, px: 2 }}>
          <Typography>{get("Menu.quranSize")}</Typography>
          <Slider
            color="secondary"
            sx={{
              " .MuiSlider-markLabel": {
                fontSize: 10,
              },
            }}
            size="small"
            value={quranFontSize}
            onChange={handleChangeQuranSize}
            step={null}
            valueLabelDisplay="off"
            marks={sizeSettingMarks(get)}
          />
        </Box>
      );
    },
  },
  {
    id: "size2",
    render: ({ get }) => {
      const { setTranslateFontSize, translateFontSize } =
        useTranslateFontSizeStore((state) => state);

      const handleTranslateQuranSize = React.useCallback(
        (_e, value) => setTranslateFontSize(value),
        [setTranslateFontSize]
      );

      return (
        <Box sx={{ flex: 1, mt: 2, px: 2 }}>
          <Typography>{get("Menu.translateSize")}</Typography>
          <Slider
            color="secondary"
            sx={{
              " .MuiSlider-markLabel": {
                fontSize: 10,
              },
            }}
            size="small"
            value={translateFontSize}
            onChange={handleTranslateQuranSize}
            step={null}
            valueLabelDisplay="off"
            marks={sizeSettingMarks(get)}
          />
        </Box>
      );
    },
  },
];
