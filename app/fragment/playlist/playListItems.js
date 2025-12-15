import * as React from "react";
import {
  Typography,
  Box,
  IconButton,
  ButtonBase,
  Collapse,
} from "@mui/material";
import _ from "lodash";
import PlayListItem from "./items";
import { Button, useTheme } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslations } from "next-intl";

export const PlayListItemsList = ({
  myList,
  onAdd,
  onDelete,
  onFast,
  onEdit,
  onSelect,
  select,
  current,
  onClose,
}) => {
  const [expanded, setExpanded] = React.useState("panel1");
  const t = useTranslations("Playlist");
  const theme = useTheme();


  const onWisdomPlayer = React.useCallback((item) => {}, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 2,
        px: 2,
      }}
    >
      <Button
        onClick={onAdd}
        variant="contained"
        fullWidth
        endIcon={<AddIcon />}
      >
        {t("add")}
      </Button>
      <Box
        sx={{
          py: 2,
          pb: 6,
          width: 1 / 1,
        }}
      >
        {_.map(myList?.list, (item) => (
          <Box
            key={`${item.id}-${item.title}`}
            // expanded={expanded === `panel${item.id}`}
            // onChange={handleChange(`panel${item.id}`, item.id)}
            component={"section"}
            sx={{
              background: "transparent",
              borderRadius: 3,
              margin: theme.spacing(1, 0),
              border: 1,

              borderColor: "primary.main",
              ...(!!select &&
                current?.id === item?.id && {
                  bgcolor: "primary.main",
                  color: "white",
                }),
            }}
          >
            <ButtonBase
              aria-controls="panel1d-content"
              component={"section"}
              onClick={() => {
                onSelect(item)();
                setExpanded((prv) =>
                  prv === `panel${item.id}` ? "" : `panel${item.id}`
                );
              }}
              sx={{
                width: 1 / 1,
                px: 2,
                minHeight: 40,
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>{item.title}</Typography>
              {/* <Typography sx={{ mx: 1, fontSize: 12 }} variant="subtitle1">
                {item.date}
              </Typography> */}
              <Box sx={{ flex: 1 }} />
              {!!!select && (
                <>
                  {/* <IconButton>
                    <Box
                      disabled
                      component={"img"}
                      sx={{ width: 16, opacity: 0.5 }}
                      src={`/icons/${theme.palette.mode}/share.svg`}
                    />
                  </IconButton> */}
                  <IconButton onClick={onDelete({ show: true, item })}>
                    <Box
                      component={"img"}
                      sx={{ width: 16 }}
                      src={`/icons/${theme.palette.mode}/delete.svg`}
                    />
                  </IconButton>
                  <IconButton onClick={onEdit(item)}>
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </ButtonBase>
            {!!!select && (
              <Collapse in={expanded === `panel${item.id}`} sx={{ px: 2 }}>
                {_.map(item?.content?.lectures, (item, index) => (
                  <PlayListItem
                    key={`${item.id}-${item.lectureId}-${index}`}
                    onDelete={onDelete}
                    onFast={onFast}
                    item={item}
                    isLecture
                    matches={true}
                    onClose={onClose}
                  />
                ))}
                {_.map(item?.content?.topics, (item, index) => (
                  <PlayListItem
                    key={`${item.id}-${item.topicId}-${index}`}
                    onDelete={onDelete}
                    item={item}
                    onFast={onFast}
                    isTopic
                    matches={true}
                    onClose={onClose}
                  />
                ))}
                {_.map(item?.content?.wisdom, (item, index) => (
                  <PlayListItem
                    key={`${item.id}-${item.id}-${index}`}
                    onDelete={onDelete}
                    item={item}
                    onFast={onWisdomPlayer}
                    isWisdom
                    matches={true}
                    onClose={onClose}
                  />
                ))}
              </Collapse>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
