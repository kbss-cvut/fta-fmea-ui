import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { FaultEvent } from "@models/eventModel";
import { axiosSource } from "@services/utils/axiosUtils";
import { ChildrenProps } from "@utils/hookUtils";
import * as faultTreeService from "@services/faultTreeService";
import { SnackbarType, useSnackbar } from "./useSnackbar";

type faultEventsContextType = FaultEvent[];

export const faultEventsContext = createContext<faultEventsContextType>(null!);

export const useReusableFaultEvents = () => {
  return useContext(faultEventsContext);
};

interface Props extends ChildrenProps {
  treeUri?: string;
  systemUri?: string;
}

export const ReusableFaultEventsProvider = ({ children, treeUri, systemUri }: Props) => {
  const [_faultEvents, _setFaultEvents] = useState<FaultEvent[]>([]);
  const [showSnackbar] = useSnackbar();

  useEffect(() => {
    const fetchFaultEvents = async () => {
      if (!systemUri && !treeUri) return;

      const eventsPromise = treeUri
        ? faultTreeService.getAllReusableEvents(treeUri)
        : faultTreeService.getRootReusableEvents(systemUri);
      eventsPromise.then((value) => _setFaultEvents(value)).catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
    };

    fetchFaultEvents();
    return () => axiosSource.cancel("ReusableFaultEventsProvider - unmounting");
  }, [treeUri, systemUri]);

  return <faultEventsContext.Provider value={_faultEvents}>{children}</faultEventsContext.Provider>;
};
