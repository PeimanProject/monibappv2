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
import { Close } from "@mui/icons-material";
import { useMyPlayListStore } from "@/store/playListStore";
import { PlayListItemsList } from "./playListItems";
import { ManagePlaylist } from "./manage";
import { useTranslate } from "@/core/useTranslation";
import { useUserStore } from "@/store/useUserStore";
import { AddUserPlayListByType } from "@/app/data/user/playlist/add/route";

export const SelectMyPlayListControl = () => {
  const { user } = useUserStore()
  const [{ showManage, playlist }, setManage] = React.useState({
    showManage: false,
    playlist: null,
  });
  const [current, setCurrent] = React.useState(null);
  const show = useAddToPlayListStore((state) => state.show);
  const item = useAddToPlayListStore((state) => state.item);
  const setShow = useAddToPlayListStore((state) => state.setShow);
  const { list, fetchList } = useMyPlayListStore((state) => state);
  const { get } = useTranslate()
  // Page 1 & Page 2 useEffect
  React.useEffect(() => {
    const load = async () => {
      // Check for show AND user?.token
      if (!show || !user?.token) return;
      await fetchList(user.token);
    };

    load();
  }, [show, user?.token]); // Add user?.token to dependencies

  const handleSelected = React.useCallback(
    (newValue) => async () => {
      setCurrent(newValue);

      if (!!item?.lecture) {
        await AddUserPlayListByType({
          token: user?.token,
          lectureId: item.lectureId,
          playlistIds: [{ id: newValue.id }],
          type: "lecture"
        })

      }

      setShow(false);
      setCurrent(null);
    },
    [setCurrent, setShow, item, user?.token]
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
            {get("Playlist.title")}
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
