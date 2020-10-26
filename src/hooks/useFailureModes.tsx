import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {CreateFailureMode, FailureMode} from "@models/failureModeModel";
import * as failureModeService from "@services/failureModeService"
import * as functionService from "@services/functionService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";


type failureModeContextType = [FailureMode[], (functionIri: string, failureMode: CreateFailureMode) => void];

export const failureModesContext = createContext<failureModeContextType>(null!);

export const useFailureModes = () => {
    const [failureModes, addFailureMode] = useContext(failureModesContext);
    return [failureModes, addFailureMode] as const;
}

export const FailureModesProvider = ({children}: ChildrenProps) => {
    const [_failureModes, _setFailureModes] = useState<FailureMode[]>([]);

    const addFailureMode = async (functionIri: string, failureMode: CreateFailureMode) => {
        const newFailureMode = await functionService.addFailureMode(functionIri, failureMode)
        _setFailureModes([..._failureModes, newFailureMode])
    }

    useEffect(() => {
        const fetchFailureModes = async () => {
            const failureModes = await failureModeService.findAll();
            console.log(failureModes)
            _setFailureModes(failureModes)
        }

        fetchFailureModes()

        return () => {axiosSource.cancel("FailureModesProvider - unmounting")}
    }, []);

    return (
        <failureModesContext.Provider value={[_failureModes, addFailureMode]}>
            {children}
        </failureModesContext.Provider>
    );
}