import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {CreateFunction, Function} from "@models/functionModel";
import * as componentService from "@services/componentService"
import * as functionService from "@services/functionService"
import {axiosSource} from "@services/utils/axiosUtils";
import {SnackbarType, useSnackbar} from "./useSnackbar";
import {filter} from "lodash";
import {Component} from "@models/componentModel";
import {FaultTree} from "@models/faultTreeModel";
import {getComponent} from "@services/functionService";
import {FailureMode} from "@models/failureModeModel";


type functionContextType = [
    Function[],
    (f: Function) => Promise<any>,
    (funcToEdit: Function) => void,
    (funcToDelete: Function) => void,
    (functionUri: string, requiredFunctionUri: string) => void,
    Function[],
    [Function,Component][],
    (functionUri: string, systemName:string, functionName: string) => Promise<FaultTree>,
    (functionUri: string) => Promise<FailureMode[]>
];

export const functionsContext = createContext<functionContextType>(null!);

export const useFunctions = () => {
    const  [functions, addFunction, editFunction, deleteFunction, addRequiredFunction, allFunctions, functionsAndComponents, generateFDTree, getFailureModes] = useContext(functionsContext);
    return [functions, addFunction, editFunction, deleteFunction, addRequiredFunction, allFunctions, functionsAndComponents, generateFDTree, getFailureModes] as const;
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

    const editFunction = async(f: Function) =>{
        functionService.editFunction(f)
            .then(() => showSnackbar('Function edited', SnackbarType.SUCCESS))
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const addRequiredFunction = async (functionUri: string, requiredFunctionUri: string) =>{
        functionService.addRequiredFunction(functionUri,requiredFunctionUri)
            .catch(reason=> showSnackbar(reason, SnackbarType.ERROR))
    }

    const removeFunction = async (f: Function) => {
        componentService.removeFunction(componentUri, f.iri)
            .then(value => {
                showSnackbar('Function removed', SnackbarType.SUCCESS)
                const updatedFunctions = filter(_functions, (el) => el.iri !== f.iri)
                _setFunctions(updatedFunctions)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const generateFDTree = async (functionUri: string, systemName:string, functionName: string): Promise<FaultTree> => {
        let componentName = await getComponent(functionUri).then(value => value.name)
        return functionService.generateFDTree(functionUri,encodeURIComponent(systemName + "_" + componentName + "_" + functionName))
            .then(value => {
                showSnackbar('Functional dependency tree generated.', SnackbarType.SUCCESS)
                return value
            })
            .catch(reason => {
                showSnackbar(reason, SnackbarType.ERROR)
                return null
            })

    }

    const getFailureModes = async(functionUri: string) => {
        return functionService.getImpairedBehavior(functionUri)
            .then(value => {return value})
            .catch(reason => {
                showSnackbar(reason, SnackbarType.ERROR)
                return null
            })
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
        <functionsContext.Provider value={[_functions, addFunction,editFunction, removeFunction,addRequiredFunction, _allFunctions, _functionsAndComponents,generateFDTree,getFailureModes]}>
            {children}
        </functionsContext.Provider>
    );
}