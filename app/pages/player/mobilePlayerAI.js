"use client";

import {
  Box,
  Button,
  styled,
  Menu,
  alpha,
  Typography,
  IconButton,
  useTheme,
  Container,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useCCTypeStore } from "@/store/player/usePlayerStore";
import _ from "lodash";
import { numberToWords } from "@persian-tools/persian-tools";
import { CustomDrawer, DrawerToolbar } from "@/app/component/customDrawer";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { TabCircleItem, TabStyle } from "@/app/component/tabStyle";
import { useTranslate } from "@/core/useTranslation";


export const CustomStyledMenu = styled(
  ({
    horizontal = "right",
    vertical = "bottom",
    verticalOrigin = "top",
    horizontalOrigin,
    ...props
  }) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical,
        horizontal,
      }}
      transformOrigin={{
        vertical: verticalOrigin,
        horizontal: horizontalOrigin,
      }}
      {...props}
    />
  )
)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: theme.spacing(2),
    padding: theme.spacing(1, 2),
    minWidth: 120,
    backgroundColor: alpha(theme.palette.primary.main, 0.92),
    marginTop: 2,
    backdropFilter: "blur(3px)",
    boxShadow: theme.shadows[5],
  },
}));

export const MobilePlayerAI = ({
  srt_en,
  srtArray,
  rowNumber,
  contextName,
}) => {
  const theme = useTheme();
  const [value, setValue] = React.useState("fa");
  const [index, setIndex] = React.useState(0);

  const handleChange = React.useCallback(
    (value, index) => () => {
      setValue(value);
      setIndex(index);
    },
    []
  );

  const { get } = useTranslate()
  const [open, setOpen] = React.useState(false);
  const [showText, setShowText] = React.useState(false);

  const anchorRef = React.useRef(null);
  const { type, setType } = useCCTypeStore((state) => state);
  const handleClose = React.useCallback((event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }, []);

  const handleToggle = React.useCallback(
    () => setOpen((prevOpen) => !prevOpen),
    []
  );

  const handleShowText = React.useCallback(
    (show) => () => setShowText(show),
    []
  );

  const handleChangeCCType = React.useCallback(
    (event) => {
      setType(event.target.value);
      setOpen(false);
    },
    [setType]
  );

  return (
    <>
      <Box
        sx={{
          mt: 0.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <Button
          size="small"
          color="primary"
          variant="contained"
          disableElevation
          sx={{ mx: 0.2 }}
          fullWidth
          onClick={handleToggle}
          ref={anchorRef}
          endIcon={
            <Image
              alt="cc"
              src={`/icons/${theme.palette.mode}/cc.svg`}
              width={24}
              height={24}
            />
          }
        >
          {get("Lecture.cc")}
        </Button>
        <CustomStyledMenu
          onClose={handleClose}
          open={open}
          anchorEl={anchorRef.current}
        >
          <RadioGroup value={type} onChange={handleChangeCCType}>
            <FormControlLabel
              value="fa"
              control={<Radio color="default" />}
              label={get("Lecture.cc_fa")}
            />
            {srt_en?.fileName && (
              <FormControlLabel
                value="en"
                control={<Radio color="default" />}
                label={get("Lecture.cc_en")}
              />
            )}
            <FormControlLabel
              value="off"
              control={<Radio color="default" />}
              label={get("Lecture.cc_off")}
            />
          </RadioGroup>
        </CustomStyledMenu>

        <Button
          size="small"
          color="primary"
          variant="contained"
          disableElevation
          sx={{ mx: 0.2 }}
          fullWidth
          onClick={handleShowText(true)}
          endIcon={
            <Image
              alt="transcript"
              src={`/icons/${theme.palette.mode}/transcript.svg`}
              width={24}
              height={24}
            />
          }
        >
          {get("Lecture.transcript")}
        </Button>
      </Box>
      <CustomDrawer
        anchor={"bottom"}
        open={showText}
        hideBackdrop={false}
        onClose={handleShowText(false)}
      >

        <DrawerToolbar onClose={handleShowText(false)}>
          {!!rowNumber && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: 14 }}
                >
                  {contextName}
                </Typography>
              </Box>
              <Typography>
                {get("Lecture.lecture")} {numberToWords(rowNumber, { ordinal: true })}
              </Typography>
            </Box>
          )}
          <Box sx={{ flex: 1 }} />
          {!!srtArray["en"] && (
            <TabStyle style="circle" index={index}>
              <TabCircleItem
                onChange={handleChange}
                value={"fa"}
                index={0}
                selected={value === "fa"}
              >
                <Typography>{get("Lecture.cc_s_fa")}</Typography>
              </TabCircleItem>
              <TabCircleItem
                onChange={handleChange}
                value={"en"}
                index={1}
                selected={value === "en"}
              >
                <Typography>{get("Lecture.cc_s_en")}</Typography>
              </TabCircleItem>
            </TabStyle>
          )}
          <CopyToClipboard text={_.join(_.map(srtArray[value], "text"), " ")}>
            <IconButton>
              <ContentCopyIcon />
            </IconButton>
          </CopyToClipboard>
        </DrawerToolbar>
        <Box
          sx={{
            maxHeight: "calc(100vh - 200px)",
            position: "relative",
          }}
        >
          <Container>
            <Typography
              component={"div"}
              sx={{
                textAlign: "justify",
                pt: 2,
                px: 3,
                pb: 22,
                lineHeight: 1.8,
              }}
            >
              {srtArray[value]?.map((item, index) => (
                <p key={index}>{item.text}</p>
              ))}
            </Typography>
          </Container>
        </Box>
      </CustomDrawer>
    </>
  );
};
