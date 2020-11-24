import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {FaultTree} from "@models/faultTreeModel";
import * as faultTreeService from "@services/faultTreeService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

type faultTreeContextType = [FaultTree, () => void];

export const faultTreeContext = createContext<faultTreeContextType>(null!);

export const useCurrentFaultTree = () => {
    const [faultTree, refreshTree] = useContext(faultTreeContext);
    return [faultTree, refreshTree] as const;
}

interface Props extends ChildrenProps {
    faultTreeIri: string,
}

export const CurrentFaultTreeProvider = ({faultTreeIri, children}: Props) => {
    const [_faultTree, _setFaultTree] = useState<FaultTree>();
    const [showSnackbar] = useSnackbar()

    const fetchFaultTree = async () => {
        faultTreeService.find(faultTreeIri)
            .then(value => _setFaultTree(value))
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const refreshTree = fetchFaultTree;

    useEffect(() => {
        fetchFaultTree()

        return () => axiosSource.cancel("CurrentFaultTreeProvider - unmounting")
    }, []);

    return (
        <faultTreeContext.Provider value={[_faultTree, refreshTree]}>
            {children}
        </faultTreeContext.Provider>
    );
}