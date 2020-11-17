import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {FaultTree} from "@models/faultTreeModel";
import * as faultTreeService from "@services/faultTreeService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

type faultTreeContextType = [FaultTree, (faultTree: FaultTree) => void];

export const faultTreeContext = createContext<faultTreeContextType>(null!);

export const useCurrentFaultTree = () => {
    const [faultTree, updateFaultTree] = useContext(faultTreeContext);
    return [faultTree, updateFaultTree] as const;
}

interface Props extends ChildrenProps {
    faultTreeIri: string,
}

export const CurrentFaultTreeProvider = ({faultTreeIri, children}: Props) => {
    const [_faultTree, _setFaultTree] = useState<FaultTree>();
    const [showSnackbar] = useSnackbar()

    const updateFaultTree = async (faultTree: FaultTree) => {
        faultTreeService.update(faultTree)
            .then(value => {
                showSnackbar('Fault Tree updated', SnackbarType.SUCCESS)
                _setFaultTree(value)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    useEffect(() => {
        const fetchFaultTree = async () => {
            faultTreeService.find(faultTreeIri)
                .then(value => _setFaultTree(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchFaultTree()

        return () => {
            axiosSource.cancel("CurrentFaultTreeProvider - unmounting")
        }
    }, []);

    return (
        <faultTreeContext.Provider value={[_faultTree, updateFaultTree]}>
            {children}
        </faultTreeContext.Provider>
    );
}