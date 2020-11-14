import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {FaultEvent} from "@models/eventModel";
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import * as faultEventService from "@services/faultEventService";
import {SnackbarType, useSnackbar} from "./useSnackbar";


type faultEventsContextType = FaultEvent[];

export const faultEventsContext = createContext<faultEventsContextType>(null!);

export const useFaultEvents = () => {
    return useContext(faultEventsContext);
}

export const FaultEventsProvider = ({children}: ChildrenProps) => {
    const [_faultEvents, _setFaultEvents] = useState<FaultEvent[]>([]);
    const [showSnackbar] = useSnackbar();

    useEffect(() => {
        const fetchFaultEvents = async () => {
            faultEventService.findFaultEvents()
                .then(value => _setFaultEvents(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchFaultEvents()
        return () => {
            axiosSource.cancel("FaultEventsProvider - unmounting")
        }
    }, []);

    return (
        <faultEventsContext.Provider value={_faultEvents}>
            {children}
        </faultEventsContext.Provider>
    );
}