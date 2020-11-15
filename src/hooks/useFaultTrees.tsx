import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {FaultTree} from "@models/faultTreeModel";
import * as faultTreeService from "@services/faultTreeService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {OpenTabsProvider} from "./useOpenTabs";
import {filter} from "lodash";

type faultTreeContextType = [
    FaultTree[],
    (faultTree: FaultTree) => void,
    (faultTree: FaultTree) => void,
];

export const faultTreesContext = createContext<faultTreeContextType>(null!);

export const useFaultTrees = () => {
    const [faultTrees, addFaultTree, removeTree] = useContext(faultTreesContext);
    return [faultTrees, addFaultTree, removeTree] as const;
}

export const FaultTreesProvider = ({children}: ChildrenProps) => {
    const [_faultTrees, _setFaultTrees] = useState<FaultTree[]>([]);
    const [showSnackbar] = useSnackbar()

    useEffect(() => {
        const fetchFaultTrees = async () => {
            faultTreeService.findAll()
                .then(value => _setFaultTrees(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchFaultTrees()

        return () => axiosSource.cancel("FaultTreesProvider - unmounting")
    }, []);

    const addFaultTree = async (faultTree: FaultTree) => {
        faultTreeService.create(faultTree)
            .then(value => {
                showSnackbar('Fault Tree created', SnackbarType.SUCCESS)
                _setFaultTrees([..._faultTrees, value])
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const removeTree = async(treeToRemove: FaultTree) => {
        faultTreeService.remove(treeToRemove.iri)
            .then(value => {
                const updatedTrees = filter(_faultTrees, (el) => el.iri !== treeToRemove.iri)
                console.log(`updatedTrees - ${JSON.stringify(updatedTrees)}`)
                _setFaultTrees(updatedTrees)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    return (
        <faultTreesContext.Provider value={[_faultTrees, addFaultTree, removeTree]}>
            <OpenTabsProvider>
                {children}
            </OpenTabsProvider>
        </faultTreesContext.Provider>
    );
}