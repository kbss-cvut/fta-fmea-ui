import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {System} from "@models/systemModel";
import * as systemService from "@services/systemService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

type systemContextType = [System, (systemToUpdate: System) => void];

export const systemContext = createContext<systemContextType>(null!);

export const useCurrentSystem = () => {
    const [system, updateSystem] = useContext(systemContext);
    return [system, updateSystem] as const;
}

interface Props extends ChildrenProps {
    systemIri: string,
}

export const CurrentSystemProvider = ({systemIri, children}: Props) => {
    const [_system, _setSystem] = useState<System>();
    const [showSnackbar] = useSnackbar()

    const updateSystem = async (system: System) => {
        systemService.update(system)
            .then(value => {
                showSnackbar('System updated', SnackbarType.SUCCESS)
                _setSystem(value)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    useEffect(() => {
        const fetchSystem = async () => {
            systemService.find(systemIri)
                .then(value => _setSystem(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchSystem()

        return () => {
            axiosSource.cancel("CurrentFaultTreeProvider - unmounting")
        }
    }, []);

    return (
        <systemContext.Provider value={[_system, updateSystem]}>
            {children}
        </systemContext.Provider>
    );
}