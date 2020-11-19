import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {FaultEvent} from "@models/eventModel";
import {axiosSource} from "@services/utils/axiosUtils";
import * as treeNodeService from "@services/treeNodeService";


export const faultEventPathContext = createContext<FaultEvent[]>([]);

export const useEventPathToRoot = () => {
    return useContext(faultEventPathContext);
}

interface Props {
    leafNodeIri: string,
    children: React.ReactNode,
}

export const EventPathToRootProvider = ({children, leafNodeIri}: Props) => {
    const [_eventPath, _setEventPath] = useState<FaultEvent[]>([]);

    useEffect(() => {
        const resolveEventPath = async () => {
            treeNodeService
                .eventPathToRoot(leafNodeIri)
                .then(value => _setEventPath(value))
                .catch(reason => console.log(`Failed to resolve event path - ${reason}`))
        }

        resolveEventPath()
        return () => axiosSource.cancel("EventPathToRootProvider - unmounting")
    }, [leafNodeIri]);

    return (
        <faultEventPathContext.Provider value={_eventPath}>
            {children}
        </faultEventPathContext.Provider>
    );
}