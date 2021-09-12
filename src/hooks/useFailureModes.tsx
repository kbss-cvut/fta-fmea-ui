import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import * as failureModeService from "@services/failureModeService"
import {FailureMode} from "@models/failureModeModel";
import {ChildrenProps} from "@utils/hookUtils";

type failureModeContextType = [
    FailureMode[],
    () => void
];

const failureModeContext = createContext<failureModeContextType>(null!);

export const useFailureMode = () => {
    const  [allFailureModes, fetchAllFailureModes] = useContext(failureModeContext);
    return [allFailureModes, fetchAllFailureModes] as const;
}

export const FailureModeProvider = ({children}: ChildrenProps) => {
    const [_allFailureModes, _setAllFailureModes] = useState<FailureMode[]>()

    const fetchAllFailureModes = async () => {
        failureModeService.findAll()
            .then(value => _setAllFailureModes(value))
            .catch(() => _setAllFailureModes(null))
    }

    useEffect(() => {
        fetchAllFailureModes()
    },[])

    return (
        <failureModeContext.Provider value={[ _allFailureModes, fetchAllFailureModes]}>
            {children}
        </failureModeContext.Provider>
    );
}