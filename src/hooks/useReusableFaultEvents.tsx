import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

import { FaultEvent } from "@models/eventModel";
import { axiosSource } from "@services/utils/axiosUtils";
import { ChildrenProps } from "@utils/hookUtils";
import * as faultEventService from "@services/faultEventService";
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

export const FaultEventsReuseProvider = ({ children, treeUri, systemUri }: Props) => {
  const [_faultEvents, _setFaultEvents] = useState<FaultEvent[]>([]);
  const [showSnackbar] = useSnackbar();

  useEffect(() => {
    const fetchFaultEvents = async () => {
      if(!systemUri)
        return;

      const eventsPromise = treeUri
        ? faultTreeService.getAllReusableEvents(systemUri, treeUri)
        : faultTreeService.getRootReusableEvents(systemUri);
      eventsPromise.then((value) => _setFaultEvents(value)).catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
    };

    fetchFaultEvents();
    return () => axiosSource.cancel("FaultEventsReuseProvider - unmounting");
  }, []);

  return <faultEventsContext.Provider value={_faultEvents}>{children}</faultEventsContext.Provider>;
};
