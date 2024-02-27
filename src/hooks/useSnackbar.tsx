import * as React from "react";
import { createContext, useContext, useState } from "react";
import { ChildrenProps } from "@utils/hookUtils";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/lab";

export enum SnackbarType {
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  SUCCESS = "success",
}

type snackbarContextType = [(string, SnackbarType) => void];

const snackbarContext = createContext<snackbarContextType>(null!);

export const useSnackbar = () => {
  const [showSnackbar] = useContext(snackbarContext);
  return [showSnackbar] as const;
};

export const SnackbarProvider = ({ children }: ChildrenProps) => {
  const [open, _setOpen] = useState(false);
  const [message, setMessage] = useState<string>();
  const [alertType, setAlertType] = useState<SnackbarType>(SnackbarType.INFO);

  const showSnackbar = (message: string, snackbarType: SnackbarType) => {
    _setOpen(true);
    setMessage(message);
    setAlertType(snackbarType);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    _setOpen(false);
  };

  return (
    <snackbarContext.Provider value={[showSnackbar]}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={() => _setOpen(false)}
        autoHideDuration={2500}
        key="fta-snackbar"
      >
        <Alert onClose={handleClose} severity={alertType}>
          {message}
        </Alert>
      </Snackbar>
    </snackbarContext.Provider>
  );
};
