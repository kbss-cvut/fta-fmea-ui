import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {FailureMode} from "@models/failureModeModel";
import * as failureModeService from "@services/failureModeService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

type failureModeContextType = [FailureMode, (failureMode: FailureMode) => void];

export const failureModeContext = createContext<failureModeContextType>(null!);

export const useCurrentFailureMode = () => {
    const [failureMode, updateFailureMode] = useContext(failureModeContext);
    return [failureMode, updateFailureMode] as const;
}

interface Props extends ChildrenProps {
    failureModeIri: string,
}

export const CurrentFailureModeProvider = ({failureModeIri, children}: Props) => {
    const [_failureMode, _setFailureMode] = useState<FailureMode>();
    const [showSnackbar] = useSnackbar()

    const updateFailureMode = async (failureMode: FailureMode) => {
        failureModeService.update(failureMode)
            .then(value => {
                showSnackbar('Failure mode updated', SnackbarType.SUCCESS)
                _setFailureMode(failureMode)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    useEffect(() => {
        const fetchFailureMode = async () => {
            failureModeService.find(failureModeIri)
                .then(value => _setFailureMode(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchFailureMode()

        return () => {
            axiosSource.cancel("FailureModeProvider - unmounting")
        }
    }, []);

    return (
        <failureModeContext.Provider value={[_failureMode, updateFailureMode]}>
            {children}
        </failureModeContext.Provider>
    );
}