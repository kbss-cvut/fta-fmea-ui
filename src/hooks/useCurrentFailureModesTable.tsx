import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import * as failureModesTableService from "@services/failureModesTableService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {FailureModesTableData} from "@models/failureModesTableModel";

const failureModesTableContext = createContext<FailureModesTableData>(null!);

export const useCurrentFailureModesTable = () => {
    return useContext(failureModesTableContext);
}

interface Props extends ChildrenProps {
    tableIri: string,
}

export const CurrentFailureModesTableProvider = ({tableIri, children}: Props) => {
    const [_tableData, _setTableData] = useState<FailureModesTableData>();
    const [showSnackbar] = useSnackbar()

    useEffect(() => {
        const fetchTableData = async () => {
            failureModesTableService.computeTableData(tableIri)
                .then(value => _setTableData(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchTableData()

        return () => axiosSource.cancel("CurrentFailureModesTableProvider - unmounting")
    }, []);

    return (
        <failureModesTableContext.Provider value={_tableData}>
            {children}
        </failureModesTableContext.Provider>
    );
}