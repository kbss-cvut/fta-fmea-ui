import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {CreateFailureMode, FailureMode} from "@models/failureModeModel";
import * as failureModeService from "@services/failureModeService"
import * as functionService from "@services/functionService"


type failureModeContextType = [FailureMode[], (functionIri: string, failureMode: CreateFailureMode) => void];

export const failureModesContext = createContext<failureModeContextType>(null!);

export const useFailureModes = () => {
    const [failureModes, addFailureMode] = useContext(failureModesContext);
    return [failureModes, addFailureMode] as const;
}

type FailureModesProviderProps = {
    children: React.ReactNode;
};

export const FailureModesProvider = ({children}: FailureModesProviderProps) => {
    const [_failureModes, _setFailureModes] = useState<FailureMode[]>([]);

    const addFailureMode = async (functionIri: string, failureMode: CreateFailureMode) => {
        const newFailureMode = await functionService.addFailureMode(functionIri, failureMode)
        _setFailureModes([..._failureModes, newFailureMode])
    }

    useEffect(() => {
        const fetchFailureModes = async () => {
            _setFailureModes(await failureModeService.findAll())
        }

        fetchFailureModes()
    }, []);

    return (
        <failureModesContext.Provider value={[_failureModes, addFailureMode]}>
            {children}
        </failureModesContext.Provider>
    );
}