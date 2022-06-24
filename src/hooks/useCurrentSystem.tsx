import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {System} from "@models/systemModel";
import * as systemService from "@services/systemService"
import {axiosSource} from "@services/utils/axiosUtils";
import {ChildrenProps} from "@utils/hookUtils";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {Component} from "@models/componentModel";
import {cloneDeep, flatten, concat, filter, findIndex} from "lodash";

type systemContextType = [
    System,
    (addComponent: Component) => void,
    (updateComponent: Component) => void,
    (removeComponent: Component) => void,
    () => void
]

export const systemContext = createContext<systemContextType>(null!);

export const useCurrentSystem = () => {
    const [system, addComponent, updateComponent, removeComponent, fetchSystem] = useContext(systemContext);
    return [system, addComponent, updateComponent, removeComponent, fetchSystem] as const;
}

interface Props extends ChildrenProps {
    systemIri: string,
}

export const CurrentSystemProvider = ({systemIri, children}: Props) => {
    const [_system, _setSystem] = useState<System>();
    const [showSnackbar] = useSnackbar()

    const addComponent = async (component: Component) => {
        systemService
            .addComponent(systemIri, component.iri)
            .then(value => {
                const systemClone = cloneDeep(_system);
                systemClone.components = concat(flatten([systemClone.components]), component);
                _setSystem(systemClone);
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const updateComponent = (componentToUpdate: Component) => {
        const systemClone = cloneDeep(_system);
        const components = flatten([systemClone.components])

        const index = findIndex(components, el => el.iri === componentToUpdate.iri);
        components.splice(index, 1, componentToUpdate);
        systemClone.components = components

        _setSystem(systemClone);
    }

    const removeComponent = async (component: Component) => {
        systemService
            .removeComponent(systemIri, component.iri)
            .then(value => {
                const systemClone = cloneDeep(_system);
                systemClone.components = filter(flatten([systemClone.components]), (el) => el.iri !== component.iri);
                _setSystem(systemClone);
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const fetchSystem = async () => {
        systemService.find(systemIri)
            .then(value => _setSystem(value))
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    useEffect(() => {
        fetchSystem()

        return () => {
            axiosSource.cancel("CurrentFaultTreeProvider - unmounting")
        }
    }, []);

    return (
        <systemContext.Provider value={[_system, addComponent, updateComponent, removeComponent, fetchSystem]}>
            {children}
        </systemContext.Provider>
    );
}