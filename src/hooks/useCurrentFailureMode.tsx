import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import * as failureModeService from "@services/failureModeService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {FailureMode} from "@models/failureModeModel";
import {FailureModeComponentProvider} from "./useCurrentFailureModeComponent";

type failureModeContextType = [FailureMode];

export const failureModeContext = createContext<failureModeContextType>(null!);

export const useCurrentFailureMode = () => {
    const [failureMode] = useContext(failureModeContext);
    return [failureMode] as const;
}

interface Props extends ChildrenProps {
    failureModeIri: string,
}

export const CurrentFailureModeProvider = ({failureModeIri, children}: Props) => {
    const [_failureMode, _setFailureMode] = useState<FailureMode>();
    const [showSnackbar] = useSnackbar()

    useEffect(() => {
        const fetchFailureMode = async () => {
            failureModeService.find(failureModeIri)
                .then(value => _setFailureMode(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchFailureMode()

        return () => axiosSource.cancel("CurrentFailureModeProvider - unmounting")
    }, []);

    return (
        <failureModeContext.Provider value={[_failureMode]}>
            <FailureModeComponentProvider failureModeIri={failureModeIri}>
                {children}
            </FailureModeComponentProvider>
        </failureModeContext.Provider>
    );
}