import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import * as faultEventService from "@services/faultEventService";
import { axiosSource } from "@services/utils/axiosUtils";
import { ChildrenProps } from "@utils/hookUtils";
import { FailureMode } from "@models/failureModeModel";
import { SnackbarType, useSnackbar } from "@hooks/useSnackbar";

type failureModeContextType = [FailureMode, () => void, () => void];

const failureModeContext = createContext<failureModeContextType>(null!);

export const useEventFailureMode = () => {
  const [failureMode, deleteFailureMode, refreshFailureMode] = useContext(failureModeContext);
  return [failureMode, deleteFailureMode, refreshFailureMode] as const;
};

interface Props extends ChildrenProps {
  eventIri: string;
}

export const EventFailureModeProvider = ({ eventIri, children }: Props) => {
  const [showSnackbar] = useSnackbar();
  const [_failureMode, _setFailureMode] = useState<FailureMode>();

  useEffect(() => {
    if (eventIri) {
      fetchFailureMode();
    }

    return () => axiosSource.cancel("EventFailureModeProvider - unmounting");
  }, [eventIri]);

  const fetchFailureMode = async () => {
    faultEventService
      .getFailureMode(eventIri)
      .then((value) => _setFailureMode(value))
      .catch((reason) => _setFailureMode(null));
  };

  const deleteFailureMode = () => {
    faultEventService
      .deleteFailureMode(eventIri)
      .then((value) => {
        _setFailureMode(null);
        showSnackbar("Failure Mode Deleted", SnackbarType.SUCCESS);
      })
      .catch((reason) => console.log("Failed to delete failure mode"));
  };

  return (
    <failureModeContext.Provider value={[_failureMode, deleteFailureMode, fetchFailureMode]}>
      {children}
    </failureModeContext.Provider>
  );
};
