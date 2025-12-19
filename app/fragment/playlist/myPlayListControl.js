"use client";

import { usePlayListStore } from "@/store/usePlayListStore";
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
import { DeletePlayList } from "./deletePlaylist";
import { useTranslate } from "@/core/useTranslation";
import { useUserStore } from "@/store/useUserStore";

export const MyPlayListControl = () => {
  const { get } = useTranslate();
  const { user } = useUserStore();

  // 1. More robust state initialization to prevent undefined property errors
  const [{ showManage, playlist }, setManage] = React.useState({
    showManage: false,
    playlist: null,
  });

  const [current, setCurrent] = React.useState(null);
  const show = usePlayListStore((state) => state.show);
  const setShow = usePlayListStore((state) => state.setShow);
  const { list, fetchList } = useMyPlayListStore((state) => state);

  const [
    { showDeleteList, deletedPlaylistId, item, isLecture, isTopic, isWisdom },
    setDeletedPlaylist,
  ] = React.useState({
    showDeleteList: false,
    deletedPlaylistId: null,
    item: null,
    isLecture: false,
    isTopic: false,
    isWisdom: false,
  });
  // Page 1 & Page 2 useEffect
  React.useEffect(() => {
    const load = async () => {
      // Be VERY strict: check specifically for the token string
      if (show && user) {
        try {
          await fetchList(user.token);
        } catch (err) {
          console.error("Playlist fetch failed", err);
        }
      }
    };

    load();
  }, [show, user, fetchList]);// Add user?.token to dependencies

  const handleSelected = React.useCallback(
    (newValue) => () => {
      setCurrent(newValue);
    },
    []
  );

  const handleDeleted = React.useCallback(
    ({ show: shouldShow, id, item: delItem, isTopic: it, isLecture: il, isWisdom: iw }) =>
      async (event) => {
        event?.stopPropagation();

        // Guard: only fetch if we have a token
        if (!shouldShow && current?.id && user) {
          await fetchList(user.token);
        }

        setDeletedPlaylist({
          showDeleteList: shouldShow,
          deletedPlaylistId: id,
          item: delItem,
          isTopic: it,
          isLecture: il,
          isWisdom: iw,
        });
      },
    [current, user, fetchList] // Use token in dependencies
  );
  return (
    <>
      <DeletePlayList
        show={showDeleteList}
        onClose={() => setDeletedPlaylist({ showDeleteList: false })}
        item={item}
        isTopic={isTopic}
        isLecture={isLecture}
        isWisdom={isWisdom}
        id={deletedPlaylistId}
        currentList={current}
      />
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
            onAdd={() => setManage({ showManage: true })}
            onDelete={handleDeleted}
            onFast={() => { }}
            onEdit={(item) => () =>
              setManage({ showManage: true, playlist: item })}
            onSelect={handleSelected}
            onClose={() => setShow(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
