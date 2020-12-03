import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import * as faultTreeService from "@services/faultTreeService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {FailureModesTable} from "@models/failureModesTableModel";
import {useCurrentFaultTree} from "./useCurrentFaultTree";

const failureModesTableContext = createContext<FailureModesTable>(null!);

export const useCurrentFaultTreeTable = () => {
    return useContext(failureModesTableContext);
}

export const CurrentFaultTreeTableProvider = ({children}: ChildrenProps) => {
    const [faultTree] = useCurrentFaultTree();

    const [_table, _setTable] = useState<FailureModesTable>();
    const [showSnackbar] = useSnackbar()

    useEffect(() => {
        const fetchTable = async () => {
            faultTreeService.findFailureModesTable(faultTree.iri)
                .then(value => _setTable(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        if(faultTree) {
            fetchTable()
        }

        return () => axiosSource.cancel("CurrentFaultTreeTableProvider - unmounting")
    }, [faultTree?.iri]);

    return (
        <failureModesTableContext.Provider value={_table}>
            {children}
        </failureModesTableContext.Provider>
    );
}