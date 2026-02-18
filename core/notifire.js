"use client"

import React, { createContext, useContext, useState } from "react"
import { Snackbar, Box, Typography, IconButton } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

// 1. Create the Context
const NotifyContext = createContext(null)

// 2. Custom Hook for easy access
export function useNotify() {
    const context = useContext(NotifyContext)
    if (!context) {
        throw new Error("useNotify must be used within a NotifierProvider")
    }
    return context
}

// 3. Provider Component
export function NotifierProvider({ children }) {
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState("")
    const [severity, setSeverity] = useState("success")

    const notify = (msg, type = "success") => {
        setMessage(msg)
        setSeverity(type)
        setOpen(true)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return
        setOpen(false)
    }

    return (
        <NotifyContext.Provider value={notify}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Box
                    sx={{
                        bgcolor: "rgba(0, 0, 0, 0.46)", // Semi-transparent
                        backdropFilter: "blur(100px)",        // The glass effect
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#fff",
                        px: 3,
                        py: 1.5,
                        borderRadius: "50px",                // Pill shape
                        minWidth: 320,
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "space-between",
                        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                    }}
                >
                    {/* Use a small colored dot to indicate status */}
                    <Box
                        sx={{
                            width: 8, height: 8, borderRadius: "50%",
                            bgcolor: severity === "success" ? "#4caf50" : severity === "error" ? "#f44336" : "#2196f3",
                            mr: 1
                        }}
                    />
                    <Typography variant="body2" fontWeight={500} flexGrow={1}>
                        {message}
                    </Typography>
                    <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: "rgba(255,255,255,0.7)" }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Snackbar>
        </NotifyContext.Provider>
    )
}