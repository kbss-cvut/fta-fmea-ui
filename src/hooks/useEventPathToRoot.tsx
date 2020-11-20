import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {FaultEvent} from "@models/eventModel";
import {axiosSource} from "@services/utils/axiosUtils";
import * as faultEventService from "@services/faultEventService";


export const faultEventPathContext = createContext<FaultEvent[]>([]);

export const useEventPathToRoot = () => {
    return useContext(faultEventPathContext);
}

interface Props {
    leafEventIri: string,
    children: React.ReactNode,
}

export const EventPathToRootProvider = ({children, leafEventIri}: Props) => {
    const [_eventPath, _setEventPath] = useState<FaultEvent[]>([]);

    useEffect(() => {
        const resolveEventPath = async () => {
            faultEventService
                .eventPathToRoot(leafEventIri)
                .then(value => _setEventPath(value))
                .catch(reason => console.log(`Failed to resolve event path - ${reason}`))
        }

        resolveEventPath()
        return () => axiosSource.cancel("EventPathToRootProvider - unmounting")
    }, [leafEventIri]);

    return (
        <faultEventPathContext.Provider value={_eventPath}>
            {children}
        </faultEventPathContext.Provider>
    );
}