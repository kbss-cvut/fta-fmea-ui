import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import * as failureModeService from "@services/failureModeService"
import * as componentService from "@services/componentService"
import * as systemService from "@services/systemService"
import {FailureMode} from "@models/failureModeModel";
import {ChildrenProps} from "@utils/hookUtils";
import {filter} from "lodash";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {Component} from "@models/componentModel";
import ComponentFailureModesList from "@components/editor/system/menu/failureMode/ComponentFailureModesList";

type failureModeContextType = [
	Map<string, FailureMode>,
	(failureMode: FailureMode) => Promise<FailureMode>,
	(failureMode: FailureMode) => Promise<FailureMode>,
	() => void,
	(functionIri: string, failureModeIri: string) => void,
	(functionIri: string, failureModeIri: string) => void,
	//Map<string, FailureMode>
	FailureMode[],
	(failureMode: FailureMode, dependantFailureMode: FailureMode, type: string) => void,
	(failureMode: FailureMode, dependantFailureMode: FailureMode, type: string) => void
];

const failureModeContext = createContext<failureModeContextType>(null!);

export const useFailureMode = () => {
    const  [allFailureModes, createFailureMode, editFailureMode, fetchAllFailureModes, addFailureModeToFunction, removeFailureModeToFunction, componentFailureModes, addDependantFailureMode, removeDependantFailureMode] = useContext(failureModeContext);
    return [
		allFailureModes,
		createFailureMode,
        editFailureMode,
		fetchAllFailureModes,
		addFailureModeToFunction,
		removeFailureModeToFunction,
		componentFailureModes,
		addDependantFailureMode,
		removeDependantFailureMode,
	] as const;
}

type FailureModeProviderProps = {
    children: React.ReactNode,
    component: Component
};

export const FailureModeProvider = ({children, component}: FailureModeProviderProps) => {
    const [_allFailureModes, _setAllFailureModes] = useState<Map<string, FailureMode>>(new Map)
    const [_componentFailureModes,_setComponentFailureModes] = useState<FailureMode[]>([])
    const [showSnackbar] = useSnackbar()


    // const addFailureMode = async (failureMode: FailureMode) => {
    //     return componentService.addFailureMode(component.iri, failureMode.iri)
    //         .then(fm => {
    //             _setComponentFailureModes([..._componentFailureModes, fm])
    //             _setAllFailureModes(new Map(_allFailureModes).set(fm.iri,fm))
    //             showSnackbar('Failure mode created', SnackbarType.SUCCESS)
    //             return fm
    //         }).catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    // }

    const removeFailureMode = async (failureMode: FailureMode) => {
        componentService.removeFailureMode(component.iri, failureMode.iri)
            .then(() => {
                showSnackbar('Failure mode removed', SnackbarType.SUCCESS)
                _setComponentFailureModes(filter(_componentFailureModes, (el) => el.iri !== failureMode.iri))
                _setAllFailureModes(filter(_allFailureModes, (el) => el.iri !== failureMode.iri))
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }


    const fetchAllFailureModes = async () => {
        failureModeService.findAll()
            .then(failureModes => failureModes.forEach(failureMode => { _allFailureModes.set(failureMode.iri,failureMode)} ))
            .catch(() => _setAllFailureModes(null))
    }

    const fetchComponentFailureModes = async () => {
        componentService.failureModes(component.iri)
    //    .then(failureModes => failureModes.forEach(failureMode => { _componentFailureModes.set(failureMode.iri,failureMode)}))
        .then(failureModes => _setComponentFailureModes(failureModes))
    
    }

    const fetchSystemFailureModes = async (componentUri: string): Promise<FailureMode[]> => {
            return systemService.failureModes(componentUri)
            .then(failureModes => failureModes)
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

    const addDependantFailureMode = async (failureMode: FailureMode, dependantFailureMode: FailureMode, type: string) => {
		failureModeService
			.addDependantFailureMode(extractFragment(failureMode.iri), extractFragment(dependantFailureMode.iri), type)
			.then(() =>{
                if (type === "requiredBehavior") {
					failureMode.requiredBehaviors.push(dependantFailureMode)
				} else {
                    failureMode.childBehaviors.push(dependantFailureMode);
				}
            })
            .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
	};

	const removeDependantFailureMode = async (failureMode: FailureMode, dependantFailureMode: FailureMode, type: string ) => {
		failureModeService
			.removeDependantFailureMode(extractFragment(failureMode.iri), extractFragment(dependantFailureMode.iri), type)
			.then(() => {
                if(type === "requiredBehavior"){
                    failureMode.requiredBehaviors = filter(failureMode.requiredBehaviors, (fm) => fm.iri !== dependantFailureMode.iri);
                }else{
                    failureMode.childBehaviors = filter(failureMode.childBehaviors, (fm) => fm.iri !== dependantFailureMode.iri);
                }
            })
            .catch((reason) => showSnackbar(reason, SnackbarType.ERROR));
	};


    const createFailureMode = async (failureMode: FailureMode): Promise<FailureMode> => {
        return componentService
			.addFailureMode(extractFragment(component.iri), failureMode)
			.then((fm) => {
				_setComponentFailureModes([..._componentFailureModes, fm]);
				_setAllFailureModes(new Map(_allFailureModes).set(fm.iri, fm));
				showSnackbar("Failure mode created", SnackbarType.SUCCESS);
				return fm;
			})
    }

    const editFailureMode = async (failureMode: FailureMode): Promise<FailureMode> =>{
		return failureModeService.editFailureMode(failureMode)
			.then((value) => {
                // showSnackbar("FailureMode edited", SnackbarType.SUCCESS))
                return value
            })
    }

    useEffect(() => {
        fetchAllFailureModes()
        fetchComponentFailureModes()
    },[component])

    return (
		<failureModeContext.Provider
			value={[
				_allFailureModes,
				createFailureMode,
                editFailureMode,
				fetchAllFailureModes,
				addFailureModeToFunction,
				removeFailureModeToFunction,
				_componentFailureModes,
				addDependantFailureMode,
				removeDependantFailureMode,
			]}
		>
			{children}
		</failureModeContext.Provider>
	);
}