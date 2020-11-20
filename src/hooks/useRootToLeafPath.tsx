import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {FaultEvent} from "@models/eventModel";
import {axiosSource} from "@services/utils/axiosUtils";
import * as faultTreeService from "@services/faultTreeService";


export const faultEventPathContext = createContext<FaultEvent[]>([]);

export const useRootToLeafPath = () => {
    return useContext(faultEventPathContext);
}

interface Props {
    leafEventIri: string,
    faultTreeIri: string,
    children: React.ReactNode,
}

export const RootToLeafEventPathProvider = ({children, leafEventIri, faultTreeIri}: Props) => {
    const [_eventPath, _setEventPath] = useState<FaultEvent[]>([]);

    useEffect(() => {
        const resolveEventPath = async () => {
            faultTreeService
                .rootToLeafEventPath(faultTreeIri, leafEventIri)
                .then(value => _setEventPath(value))
                .catch(reason => console.log(`Failed to resolve event path - ${reason}`))
        }

        resolveEventPath()
        return () => axiosSource.cancel("RootToLeafEventPathProvider - unmounting")
    }, [leafEventIri]);

    return (
        <faultEventPathContext.Provider value={_eventPath}>
            {children}
        </faultEventPathContext.Provider>
    );
}