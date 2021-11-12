import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import * as failureModeService from "@services/failureModeService"
import {FailureMode} from "@models/failureModeModel";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {extractFragment} from "@services/utils/uriIdentifierUtils";

type failureModeContextType = [
    Map<string, FailureMode>,
    () => void,
    (functionIri: string, failureModeIri: string) => void,
    (functionIri: string, failureModeIri: string) => void,
];

const failureModeContext = createContext<failureModeContextType>(null!);

export const useFailureMode = () => {
    const  [allFailureModes, fetchAllFailureModes, addFailureModeToFunction, removeFailureModeToFunction] = useContext(failureModeContext);
    return [allFailureModes, fetchAllFailureModes, addFailureModeToFunction, removeFailureModeToFunction] as const;
}

export const FailureModeProvider = ({children}: ChildrenProps) => {
    const [_allFailureModes, _setAllFailureModes] = useState<Map<string, FailureMode>>(new Map)
    const [showSnackbar] = useSnackbar()

    const fetchAllFailureModes = async () => {
        failureModeService.findAll()
            .then(failureModes => failureModes.forEach(failureMode => { _allFailureModes.set(failureMode.iri,failureMode)} ))
            .catch(() => _setAllFailureModes(null))
    }

    const addFailureModeToFunction = async(functionIri: string, failureModeIri: string) => {
        failureModeService
            .addFailureModeToFunction(extractFragment(functionIri),extractFragment(failureModeIri))
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const removeFailureModeToFunction = async(functionIri: string, failureModeIri: string) => {
        failureModeService
            .removeFailureModeToFunction(extractFragment(functionIri),extractFragment(failureModeIri))
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    useEffect(() => {
        fetchAllFailureModes()
    },[])

    return (
        <failureModeContext.Provider value={[ _allFailureModes, fetchAllFailureModes, addFailureModeToFunction, removeFailureModeToFunction]}>
            {children}
        </failureModeContext.Provider>
    );
}