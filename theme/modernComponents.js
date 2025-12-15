import { alpha } from "@mui/material/styles";

export const ModernComponent = () => ({
  MuiButton: {
    defaultProps: {
      //disableElevation: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        textTransform: "none",
        fontWeight: "normal",
        variants: [
          {
            props: { variant: "contained", color: "inherit" },
            style: ({ theme }) => ({
              background: theme.palette.background.paper,
            }),
          },
        ],
      }),
    },
  },
  MuiButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.spacing(2),
      }),
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.spacing(5),
        background: theme.palette.background.paper,
        "& .MuiToggleButtonGroup-firstButton": {
          borderRadius: theme.spacing(5, 0, 0, 5),
        },
        "& .MuiToggleButtonGroup-lastButton": {
          borderRadius: theme.spacing(0, 5, 5, 0),
        },
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.spacing(3),
        backdropFilter: "blur(8px)",
        background: "rgba(255,255,255,0.5)",
        border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1),
      }),
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: ({ theme }) => ({
        // borderRadius: theme.spacing(3),
        // background: "rgba(255,255,255,0.8)",
        // border: `1px solid ${theme.palette.grey[300]}`,
        padding: theme.spacing(1),
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      backdrop: ({ theme }) => ({
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(0, 0, 0, 0.0)"
            : "rgba(255, 255, 255, 0.0)",
        //backdropFilter: "blur(4px)",
        transition: theme.transitions.create([
          "backgroundColor",
          "backdrop-filter",
        ]),
      }),
      paper: ({ theme, ownerState }) => ({
        borderRadius: !!ownerState?.fullScreen ? 0 : theme.spacing(2),
        background: alpha(theme.palette.primary.dark, 0.9),
        
        backdropFilter: "blur(12px)",
        // backdropFilter: "blur(5px)",
        // background:
        //   theme.palette.mode === "dark"
        //     ? theme.palette.grey[900]
        //     : alpha(theme.palette.background.paper, 0.75),
        "& .MuiDialogContent-root": {
          padding: 0,
          // background: alpha(theme.palette.primary.dark, 0.8),
        },
        "& .MuiDialogTitle-root": {
          zIndex: 9,
          // backdropFilter: "blur(4px)",
          position: "relative",
          padding: theme.spacing(0),
          position: "relative",
          // background:
          // background:
          //   theme.palette.mode === "dark"
          //     ? theme.palette.grey[900]
          //     : alpha(theme.palette.background.paper, 0.75),
        },
        "& .MuiDialogActions-root": {
          // boxShadow: "0 0 2px 0px rgba(0,0,0,0.2)",
          // background:
          //   theme.palette.mode === "dark"
          //     ? theme.palette.grey[900]
          //     : theme.palette.grey[50],
          //  borderTop: `1px solid ${theme.palette.divider}`,
          //background:theme.palette.background.default
        },
      }),
    },
    variants: [
      {
        props: { variant: "setting" },
        style: ({ theme }) => ({
          //backdropFilter:"blur(5px)",
          "& .MuiPaper-root": {
            borderRadius: theme.spacing(4, 4, 4, 4),
          },
        }),
      },
    ],
  },
  MuiListItemButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.spacing(2),
      }),
    },
  },
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.spacing(1),
      }),
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.spacing(2),
        background: theme.palette.primary.main,
      }),
    },
  },
  MuiTypography: {
    variants: [
      {
        props: { variant: "body1" },
        style: () => ({
          fontSize: "0.89rem",
        }),
      },
    ],
  },
  MuiFab: {
    styleOverrides: {
      root: () => ({
        boxShadow: "none",
      }),
    },
  },
});
