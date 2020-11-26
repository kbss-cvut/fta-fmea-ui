import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import * as faultTreeService from "@services/faultTreeService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {FaultEvent} from "@models/eventModel";

const faultTreePathsContext = createContext<[FaultEvent[]]>(null!);

export const useFaultTreePaths = () => {
    return useContext(faultTreePathsContext);
}

interface Props extends ChildrenProps {
    faultTreeIri: string,
}


export const FaultTreePathsProvider = ({children, faultTreeIri}: Props) => {
    const [_paths, _setPaths] = useState<[FaultEvent[]] | null>(null);
    const [showSnackbar] = useSnackbar()

    useEffect(() => {
        const fetchPaths = async () => {
            faultTreeService.getTreePaths(faultTreeIri)
                .then(value => _setPaths(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        if (faultTreeIri) {
            fetchPaths()
        }

        return () => axiosSource.cancel("FaultTreePathsProvider - unmounting")
    }, [faultTreeIri]);

    return (
        <faultTreePathsContext.Provider value={_paths}>
            {children}
        </faultTreePathsContext.Provider>
    );
}