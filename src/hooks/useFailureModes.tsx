import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import * as failureModeService from "@services/failureModeService";
import {SnackbarType, useSnackbar} from "./useSnackbar";
import {FailureMode} from "@models/failureModeModel";


type failureModesContextType = FailureMode[];

export const failureModeContext = createContext<failureModesContextType>(null!);

export const useFailureModes = () => {
    return useContext(failureModeContext);
}

export const FailureModesProvider = ({children}: ChildrenProps) => {
    const [_failureModes, _setFailureModes] = useState<FailureMode[]>([]);
    const [showSnackbar] = useSnackbar();

    useEffect(() => {
        const fetchFailureModes = async () => {
            failureModeService.findAll()
                .then(value => _setFailureModes(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchFailureModes()
        return () => {
            axiosSource.cancel("FailureModesProvider - unmounting")
        }
    }, []);

    return (
        <failureModeContext.Provider value={_failureModes}>
            {children}
        </failureModeContext.Provider>
    );
}