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

export const MyPlayListControl = () => {
  const { get } = useTranslate()
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
  ] = React.useState({ showDeleteList: false });

  React.useEffect(() => {
    const get = async () => {
      await fetchList();
    };

    get();
  }, [show]);

  const handleSelected = React.useCallback(
    (newValue) => () => {
      setCurrent(newValue);
    },
    [setCurrent]
  );

  const handleDeleted = React.useCallback(
    ({ show, id, item, isTopic, isLecture, isWisdom }) =>
      async (event) => {
        if (!show && current?.id) {
          await fetchList();
        }
        event?.stopPropagation();
        setDeletedPlaylist({
          showDeleteList: show,
          deletedPlaylistId: id,
          item,
          isTopic,
          isLecture,
          isWisdom,
        });
      },
    [setDeletedPlaylist, current]
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
