import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import * as failureModeService from "@services/failureModeService";
import {SnackbarType, useSnackbar} from "./useSnackbar";
import {FailureMode} from "@models/failureModeModel";
import {filter, findIndex} from "lodash";


type failureModesContextType = [
    FailureMode[],
    (fmToUpdate: FailureMode) => void,
    (fmToRemove: FailureMode) => void,
];

export const failureModeContext = createContext<failureModesContextType>(null!);

export const useFailureModes = () => {
    const [failureModes, updateFailureMode, removeFailureMode] = useContext(failureModeContext);
    return [failureModes, updateFailureMode, removeFailureMode] as const;
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

    const updateFailureMode = async (modeToUpdate: FailureMode) => {
        failureModeService.update(modeToUpdate)
            .then(value => {
                showSnackbar('Failure Mode updated', SnackbarType.SUCCESS)

                const index = findIndex(_failureModes, el => el.iri === modeToUpdate.iri);
                _failureModes.splice(index, 1, value);

                _setFailureModes(_failureModes)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const removeFailureMode = async (modeToRemove: FailureMode) => {
        failureModeService.remove(modeToRemove.iri)
            .then(value => {
                showSnackbar('Failure Mode removed', SnackbarType.SUCCESS)
                const updateFailureModes = filter(_failureModes, (el) => el.iri !== modeToRemove.iri)
                _setFailureModes(updateFailureModes)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    return (
        <failureModeContext.Provider value={[_failureModes, updateFailureMode, removeFailureMode]}>
            {children}
        </failureModeContext.Provider>
    );
}