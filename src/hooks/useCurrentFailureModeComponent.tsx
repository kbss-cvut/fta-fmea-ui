import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import * as failureModeService from "@services/failureModeService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {Component} from "@models/componentModel";

export const failureModeContext = createContext<[Component]>(null!);

export const useCurrentFailureModeComponent = () => {
    const [component] = useContext(failureModeContext);
    return [component] as const;
}

interface Props extends ChildrenProps {
    failureModeIri: string,
}

export const FailureModeComponentProvider = ({failureModeIri, children}: Props) => {
    const [_component, _setComponent] = useState<Component>();
    const [showSnackbar] = useSnackbar()

    useEffect(() => {
        const fetchComponent = async () => {
            failureModeService.getComponent(failureModeIri)
                .then(value => _setComponent(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchComponent()

        return () => axiosSource.cancel("FailureModeComponentProvider - unmounting")
    }, []);

    return (
        <failureModeContext.Provider value={[_component]}>
            {children}
        </failureModeContext.Provider>
    );
}