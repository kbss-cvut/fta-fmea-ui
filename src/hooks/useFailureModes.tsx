import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {FailureMode} from "@models/failureModeModel";
import * as failureModeService from "@services/failureModeService"


type failureModeContextType = [FailureMode[], (failureMode: FailureMode) => void];

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

    const addFailureMode = async (failureMode: FailureMode) => {
        const newFailureMode = await failureModeService.create(failureMode)
        _setFailureModes([..._failureModes, newFailureMode])
    }

    useEffect(() => {
        const fetchFailureModes = async () => {
            const failureModes = await failureModeService.findAll();
            _setFailureModes(failureModes)
        }

        fetchFailureModes()
    }, []);

    return (
        <failureModesContext.Provider value={[_failureModes, addFailureMode]}>
            {children}
        </failureModesContext.Provider>
    );
}