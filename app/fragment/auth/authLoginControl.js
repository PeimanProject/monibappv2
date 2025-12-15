"use client";

import { useAuthLoginStore } from "@/store/layout/useProfileStore";
import { useUserStore } from "@/store/useUserStore";
import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import React, { useRef, useState } from "react";
import _ from "lodash";
import { isMobilePhone } from "validator";
import { digitsFaToEn } from "@persian-tools/persian-tools";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/core/useTranslation";

export const AuthLoginControl = ({ }) => {
  const [showCode, setShowCode] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [codeData, setCodeData] = React.useState(null);
  const [isSubmit, setIsSubmit] = React.useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const { show, setShow } = useAuthLoginStore();
  const { get } = useTranslate()
  const router = useRouter();

  const codeRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [arrCode, setArrCode] = useState(["", "", "", ""]);

  const [{ mobile, code }, setData] = React.useState({
    mobile: "",
    code: "",
  });

  React.useEffect(() => {
    setError(false);
    setLoading(false);
    setShowCode(false);
  }, [show]);

  const handleChange = React.useCallback(
    (event) =>
      setData((prv) => {
        const cleanValue = digitsFaToEn(event.target.value).replace(/\D/g, ""); // فقط عدد
        return {
          ...prv,
          [event.target.name]: cleanValue,
        };
      }),
    []
  );

  const handleGetCode = React.useCallback(async () => {
    const codeReq = await fetch("/api/security/code", {
      method: "POST",
      body: JSON.stringify({
        mobile,
        code: "+98",
      }),
    });

    const codeRes = await codeReq.json();
    setCodeData(codeRes);
    setShowCode(true);
    setIsSubmit(false);
  }, [mobile]);

  const handleCodeChange = React.useCallback(
    (index) => (event) => {
      const value = digitsFaToEn(event.target.value).replace(/\D/g, ""); // فقط عدد

      setArrCode((prv) => {
        const newArr = [...prv];
        newArr[index] = value;

        setData((prvData) => ({
          ...prvData,
          code: digitsFaToEn(newArr.join("")),
        }));
        return newArr;
      });

      if (value.length === 1 && index < 3) {
        codeRefs[index + 1].current.focus();
      }
    },
    [codeRefs]
  );

  const handleSubmit = React.useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const resultRes = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ userId: codeData?.id, code }),
      });

      const result = await resultRes.json();

      setLoading(false);

      if (result?.error) {
        setLoading(false);
        setError(true);
      } else {
        setUser(result);
        setShow(false);
        setLoading(false);
        setError(false);
        setArrCode(["", "", "", ""]);
        router.refresh();
      }
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  }, [setShow, mobile, code, setUser, router, codeData]);

  const handleKeyDown = React.useCallback(
    (index) => (event) => {
      if (event.key === "Enter" && index < 4) {
        codeRefs[index + 1].current.focus();
      } else if (index === 3) {
      }
    },
    [codeRefs]
  );

  React.useEffect(() => {
    if (code.length === 4) {
      handleSubmit();
    }
  }, [code]);

  return (
    <Dialog
      slotProps={{
        backdrop: {
          style: {
            background: "transparent",
          },
        },
      }}
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
        <Typography variant="h6" sx={{ px: 2, color: "white" }}>
          {get("Auth.title")}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <IconButton sx={{ mr: 1 }} onClick={() => setShow(false)}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            m: 1,
            py: 2,
            px: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            // bgcolor: "background.paper",
            // borderRadius: 6,
          }}
        >
          <Typography variant="caption" sx={{ mb: 1, color: "white" }}>
            {get("Auth.mobile")}
          </Typography>
          <TextField
            // label={t("mobile")}
            value={mobile}
            onChange={handleChange}
            name="mobile"
            fullWidth
            disabled={!!showCode}
            slotProps={{
              readOnly: showCode,
              htmlInput: {
                style: {
                  textAlign: "center",
                },
              },
              input: {
                style: {
                  direction: "ltr",
                },
              },
            }}
          />
          {!!showCode && (
            <Button
              variant="contained"
              sx={{ mt: 2, minWidth: 120 }}
              disabled={loading}
              onClick={() => setShowCode(false)}
            >
              {t("change_number")}
            </Button>
          )}
          <Collapse in={!!showCode}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                direction: "rtl",
                my: 3,
              }}
            >
              {_.map(arrCode, (value, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      width: 40,
                      height: 60,
                      bgcolor: "primary.main",
                      borderRadius: 2,
                      border: 1,
                      borderColor: "primary.main",
                      mx: 1,
                      px: 1,
                    }}
                  >
                    <InputBase
                      inputRef={codeRefs[index]}
                      value={value}
                      onChange={handleCodeChange(index)}
                      onKeyDown={handleKeyDown(index)}
                      // type="number"
                      // inputMode="numeric"
                      // pattern="[0-9]*"
                      slotProps={{
                        input: {
                          inputMode: "numeric",
                          pattern: "[0-9]*",
                          style: {
                            direction: "ltr",
                            textAlign: "center",
                          },
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          </Collapse>
          <Collapse in={!!error}>
            <Typography
              sx={{ my: 2, textAlign: "center", color: "error.main" }}
            >
              {get("Auth.login_error")}
            </Typography>
          </Collapse>

          {!!!showCode && (
            <Button
              variant="contained"
              onClick={handleGetCode}
              disabled={!!!mobile || !isMobilePhone(mobile, "fa-IR")}
              sx={{ my: 2 }}
            >
              {get("Auth.get_code")}
            </Button>
          )}
          {!!showCode && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ minWidth: 120 }}
            >
              {get("Auth.login")}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
