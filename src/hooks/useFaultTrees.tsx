import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {FaultTree} from "@models/faultTreeModel";
import * as faultTreeService from "@services/faultTreeService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {OpenTabsProvider} from "./useOpenTabs";

type faultTreeContextType = [
    FaultTree[],
    (faultTree: FaultTree) => void,
];

export const faultTreesContext = createContext<faultTreeContextType>(null!);

export const useFaultTrees = () => {
    const [faultTrees, addFaultTree] = useContext(faultTreesContext);
    return [faultTrees, addFaultTree] as const;
}

export const FaultTreesProvider = ({children}: ChildrenProps) => {
    const [_faultTrees, _setFaultTrees] = useState<FaultTree[]>([]);
    const [showSnackbar] = useSnackbar()

    const addFaultTree = async (faultTree: FaultTree) => {
        faultTreeService.create(faultTree)
            .then(value => {
                showSnackbar('Fault Tree created', SnackbarType.SUCCESS)
                _setFaultTrees([..._faultTrees, value])
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    useEffect(() => {
        const fetchFaultTrees = async () => {
            faultTreeService.findAll()
                .then(value => _setFaultTrees(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchFaultTrees()

        return () => axiosSource.cancel("FaultTreesProvider - unmounting")
    }, []);

    return (
        <faultTreesContext.Provider value={[_faultTrees, addFaultTree]}>
            <OpenTabsProvider>
                {children}
            </OpenTabsProvider>
        </faultTreesContext.Provider>
    );
}