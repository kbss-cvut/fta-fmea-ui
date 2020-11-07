import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {CreateFailureMode, FailureMode} from "@models/failureModeModel";
import * as failureModeService from "@services/failureModeService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {OpenTabsProvider} from "@hooks/useOpenTabs";
import * as _ from "lodash";

type failureModeContextType = [
    FailureMode[],
    (failureMode: CreateFailureMode) => void,
    (failureMode: FailureMode) => void
];

export const failureModesContext = createContext<failureModeContextType>(null!);

export const useFailureModes = () => {
    const [failureModes, addFailureMode, updateModeLocally] = useContext(failureModesContext);
    return [failureModes, addFailureMode, updateModeLocally] as const;
}

export const FailureModesProvider = ({children}: ChildrenProps) => {
    const [_failureModes, _setFailureModes] = useState<FailureMode[]>([]);
    const [showSnackbar] = useSnackbar()

    const addFailureMode = async (failureMode: CreateFailureMode) => {
        failureModeService.create(failureMode)
            .then(value => {
                showSnackbar('Failure mode created', SnackbarType.SUCCESS)
                _setFailureModes([..._failureModes, value])
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

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

    const updateModeLocally = (modeToUpdate: FailureMode) => {
        const index = _.findIndex(_failureModes, (o: FailureMode) => o.iri === modeToUpdate.iri);

        const failureModesClone = _.cloneDeep(_failureModes)
        failureModesClone[index] = modeToUpdate
        _setFailureModes(failureModesClone)
    }

    return (
        <failureModesContext.Provider value={[_failureModes, addFailureMode, updateModeLocally]}>
            <OpenTabsProvider>
                {children}
            </OpenTabsProvider>
        </failureModesContext.Provider>
    );
}