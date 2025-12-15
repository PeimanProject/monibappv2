"use client";

import { useAddToPlayListStore } from "@/store/usePlayListStore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import React from "react";
import { useTranslations } from "next-intl";
import { Close } from "@mui/icons-material";
import { useMyPlayListStore } from "@/store/playListStore";
import { PlayListItemsList } from "./playListItems";
import { ManagePlaylist } from "./manage";

export const SelectMyPlayListControl = () => {
  const [{ showManage, playlist }, setManage] = React.useState({
    showManage: false,
    playlist: null,
  });
  const [current, setCurrent] = React.useState(null);
  const show = useAddToPlayListStore((state) => state.show);
  const item = useAddToPlayListStore((state) => state.item);
  const setShow = useAddToPlayListStore((state) => state.setShow);
  const t = useTranslations("Playlist");
  const { list, fetchList } = useMyPlayListStore((state) => state);

  React.useEffect(() => {
    const get = async () => {
      await fetchList();
    };

    get();
  }, [show]);

  const handleSelected = React.useCallback(
    (newValue) => async () => {
      setCurrent(newValue);

      if (!!item?.lecture) {
        await fetch(`/api/user/playlist/add/lecture`, {
          method: "POST",
          body: JSON.stringify({
            playlistIds: [{ id: newValue.id }],
            lectureId: item.lectureId,
          }),
        });
      }

      setShow(false);
      setCurrent(null);
    },
    [setCurrent, setShow, item]
  );

  return (
    <>
      <ManagePlaylist
        playlist={playlist}
        show={showManage}
        onClose={() => setManage({ showManage: false })}
      />
      <Dialog
        maxWidth="sm"
        fullWidth
        open={show}
        onClose={() => setShow(false)}
      >
        <DialogTitle
          sx={{
            minHeight: 46,
            display: "flex",
            alignItems: "center",
          }}
          component="div"
        >
          <Typography variant="h6" sx={{ px: 2 }}>
            {t("title")}
          </Typography>
          <Box sx={{ flex: 1 }} />
          <IconButton sx={{ mr: 1 }} onClick={() => setShow(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <PlayListItemsList
            myList={list}
            onClose={() => setShow(false)}
            select
            onAdd={() => setManage({ showManage: true })}
            onSelect={handleSelected}
            current={current}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
