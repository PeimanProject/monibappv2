import * as React from "react";
import {
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Link from "next/link";

const PlayListItem = ({
  item,
  isLecture,
  isTopic,
  isWisdom,
  onDelete,
  onFast,
  matches,
  onClose,
}) => {
  
  const getLink = React.useCallback(() => {
    if (isWisdom) {
      return `/fa/wisdom/${item.id}`;
    } else {
      return isTopic
        ? `/fa/player/${item.lectureId}?goto=${item.startTime}`
        : `/fa/player/${item.lectureId}`;
    }
  }, [isTopic, item, isWisdom]);

  const theme = useTheme();

  return (
    <>
      <Link
        href={getLink()}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <ButtonBase
          onClick={onClose}
           component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            width: 1 / 1,
            borderRadius: 4,
            flex: 1,
            height: 42,
            my: 1,
            justifyContent: "flex-start",

            "&:hover": {
              boxShadow: (theme) =>
                `${alpha(theme.palette.primary.main, 0.3)} 0 0 0 0.2rem`,
            },
          }}
        >
          {isLecture && (
            <Typography variant="caption">
              {item.seriesName} {isTopic ? item.text : item?.title}
            </Typography>
          )}
          {/* <Typography
          sx={{
            mx: 1,
            ...(matches && {
              fontSize: 12,
              wordBreak: "normal",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }),
          }}
          variant="subtitle1"
        >
          {isTopic ? item.text : item?.title}
        </Typography> */}
          <Box sx={{ flex: 1 }} />
          {/* <IconButton disabled sx={{ opacity: 0.5 }}>
          <Box
            component={"img"}
            sx={{ width: 18 }}
            src={`/icons/${theme.palette.mode}/share.svg`}
          />
        </IconButton> */}
          <IconButton
            onClick={onDelete({
              show: true,
              item,
              isTopic,
              isLecture,
              isWisdom,
            })}
          >
            <Box
              component={"img"}
              sx={{ width: 18 }}
              src={`/icons/${theme.palette.mode}/delete.svg`}
            />
          </IconButton>

          {/* <Button
          variant="outlined"
          onClick={onFast(item)}
          sx={{
            minWidth: 0,
            borderColor: "primary.main",
          }}
        >
          <Box
            component={"img"}
            sx={{ width: 12 }}
            src={`/icons/${theme.palette.mode}/quickPlay.svg`}
          />
        </Button> */}
        </ButtonBase>
      </Link>
    </>
  );
};

export default PlayListItem;
