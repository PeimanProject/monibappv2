import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useMyPlayListStore } from "@/store/playListStore";

export const ManagePlaylist = ({ playlist, show, onClose }) => {
  const [{ title, id }, setValue] = React.useState({ title: "", id: null });
  const fetchList = useMyPlayListStore((state) => state.fetchList);
  const [isSubmit, setIsSubmit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const t = useTranslations("Playlist");

  React.useEffect(() => {
    if (!!playlist?.id) {
      setValue(playlist);
    } else {
      setValue({ title: "", id: null });
    }
  }, [playlist, setValue]);

  const handleChange = React.useCallback(
    (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setValue((prv) => ({
        ...prv,
        [name]: value,
      }));
    },
    [setValue]
  );

  const submit = React.useCallback(async () => {
    setIsSubmit(true);
    if (title) {
      setIsLoading(true);
      const action = id ? "PUT" : "POST";
      await fetch(`/api/user/playlist/`, {
        method: action,
        body: JSON.stringify({ title,id }),
        headers: {
          "content-Type": "application/json",
        },
      });
      setIsLoading(false);
      setIsSubmit(false);
      await fetchList();
      onClose();
      // action({ title, id }, () => {
      //   setIsLoading(false);
      //   setIsSubmit(false);
      //   dispatch(fetchPlayList);
      //   onClose();
      // });
    }
  }, [setIsSubmit, title, id, onClose, setIsLoading]);

  React.useEffect(() => {
    setIsLoading(false);
    setIsSubmit(false);
  }, [show, setIsLoading, setIsSubmit]);

  return (
    <Dialog maxWidth="sm" open={show} onClose={onClose}>
      <DialogContent>
        <Box sx={{ p: 4 }}>
          <TextField
            onChange={handleChange}
            name="title"
            value={title}
            error={isSubmit && !title}
            label={t("playList")}
          />
          {isSubmit && !title && (
            <Typography sx={{ color: "secondary.main", mt: 1, px: 2 }}>
              {t("enterTitle")}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          disabled={isLoading || !!!title}
          onClick={submit}
          variant="contained"
        >
          {t("ok")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
