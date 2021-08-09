import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {CreateFunction, Function} from "@models/functionModel";
import * as componentService from "@services/componentService"
import * as functionService from "@services/functionService"
import {axiosSource} from "@services/utils/axiosUtils";
import {SnackbarType, useSnackbar} from "./useSnackbar";
import {filter} from "lodash";
import {Component} from "@models/componentModel";


type functionContextType = [
    Function[],
    (f: CreateFunction) => Promise<any>,
    (funcToEdit: Function) => void,
    (funcToDelete: Function) => void,
    (functionUri: string, requiredFunctionUri: string) => void,
    Function[],
    [Function,Component][]
];

export const functionsContext = createContext<functionContextType>(null!);

export const useFunctions = () => {
    const [functions, addFunction, editFunction, deleteFunction, addRequiredFunction, allFunctions,functionsAndComponents,] = useContext(functionsContext);
    return [functions, addFunction, editFunction, deleteFunction, addRequiredFunction, allFunctions,functionsAndComponents] as const;
}

type FunctionProviderProps = {
    children: React.ReactNode,
    componentUri: string
};

export const FunctionsProvider = ({children, componentUri}: FunctionProviderProps) => {
    const [_functions, _setFunctions] = useState<Function[]>([]);
    const [_allFunctions, _setAllFunctions] = useState<Function[]>([]);
    const [showSnackbar] = useSnackbar()
    const [_functionsAndComponents,_setFunctionsAndComponents] = useState<[Function,Component][]>([])

    const addFunction = async (f: Function) => {
        return componentService.addFunction(componentUri, f)
            .then(value => {
                _setFunctions([..._functions, value])
                showSnackbar('Function created', SnackbarType.SUCCESS)
                return value
            }).catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const editFunction = async(funcToEdit: Function) =>{
        functionService.editFunction(funcToEdit)
            .then(() => showSnackbar('Function edited', SnackbarType.SUCCESS))
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const addRequiredFunction = async (functionUri: string, requiredFunctionUri: string) =>{
        functionService.addRequiredFunction(functionUri,requiredFunctionUri)
            .catch(reason=> showSnackbar(reason, SnackbarType.ERROR))
    }

    const removeFunction = async (funcToRemove: Function) => {
        componentService.removeFunction(componentUri, funcToRemove.iri)
            .then(value => {
                showSnackbar('Function removed', SnackbarType.SUCCESS)
                const updatedFunctions = filter(_functions, (el) => el.iri !== funcToRemove.iri)
                _setFunctions(updatedFunctions)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    useEffect(() => {
        const fetchFunctions = async () => {
            if (componentUri) {
                componentService.functions(componentUri)
                    .then(value => _setFunctions(value))
                    .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
            }
        }

        const fetchAllFunctions = async () => {
            functionService.findAllFunctions()
                .then(func => {
                    _setAllFunctions(func)
                    _setFunctionsAndComponents([])
                    func.forEach(f => {
                        functionService.getComponent(f.iri)
                            .then(comp => {
                                _setFunctionsAndComponents(value => [...value, [f,comp]])})
                            .catch(() => {
                                _setFunctionsAndComponents(value => [...value, [f,null]])})
                    })
                })
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        fetchFunctions()
        fetchAllFunctions()
        return () => axiosSource.cancel("FunctionsProvider - unmounting")
    }, [componentUri]);

    return (
        <functionsContext.Provider value={[_functions, addFunction,editFunction, removeFunction,addRequiredFunction, _allFunctions, _functionsAndComponents]}>
            {children}
        </functionsContext.Provider>
    );
}