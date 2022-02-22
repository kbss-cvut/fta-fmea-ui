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
    (funcToEdit: Function) => Promise<Function>,
    (funcToDelete: Function) => void,
    (functionUri: string, requiredFunctionUri: string) => void,
    Function[],
    [Function,Component][],
    (functionUri: string, systemName:string, functionName: string) => Promise<FaultTree>,
    (functionUri: string) => Promise<FailureMode[]>,
    (functionUri: string, type: string) => Promise<string[]>,
    ([Function,Component], component: Component) => void
];

export const functionsContext = createContext<functionContextType>(null!);

export const useFunctions = () => {
    const [
        functions,
        addFunction,
        editFunction,
        deleteFunction,
        addRequiredFunction,
        allFunctions,
        functionsAndComponents,
        generateFDTree,
        getFailureModes,
        getTransitiveClosure,
        addExistingFunction
     ] = useContext(functionsContext);
    return [
        functions,
        addFunction,
        editFunction,
        deleteFunction,
        addRequiredFunction,
        allFunctions,
        functionsAndComponents,
        generateFDTree,
        getFailureModes,
        getTransitiveClosure,
        addExistingFunction
    ] as const;
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
    const [_functionClosures, _setFunctionClosures] = useState<Map<string, String[]>>(new Map());

    const addFunction = async (f: Function) => {
        return componentService.addFunction(componentUri, f)
            .then(value => {
                _setFunctions([..._functions, value])
                functionService.getComponent(f.iri)
					.then((comp) => {
						_setFunctionsAndComponents((value) => [...value, [f, comp]]);
					})
					.catch(() => {
						_setFunctionsAndComponents((value) => [...value, [f, null]]);
					});
                showSnackbar('Function created', SnackbarType.SUCCESS)
                return value
            }).catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const editFunction = async(f: Function): Promise<Function> =>{
        return functionService.editFunction(f)
            .then((func) => {
                _setFunctions([..._functions.filter((el) => el.iri !== f.iri), func])

                let cmp = _functionsAndComponents.find(el => el[0].iri == f.iri)[1]
               _setFunctionsAndComponents((value) => [..._functionsAndComponents.filter((el) => el[0].iri != f.iri), [f, cmp]]);
                showSnackbar('Function edited', SnackbarType.SUCCESS)
                return func
            })
            .catch(reason => {
                showSnackbar(reason, SnackbarType.ERROR)
                return null
            })
    }   

    const addExistingFunction = (functionToAdd: [Function, Component], component: Component) => {
        let func = functionToAdd[0] 
        let oldComponent = functionToAdd[1]
        
        if(oldComponent != null){
            componentService
                .removeFunction(oldComponent.iri, func.iri)
                .then(() => componentService.addFunctionByURI(componentUri, func.iri).then(f => reassignVariables(f, component)))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }else{
            componentService.addFunctionByURI(componentUri, func.iri)
                .then(f => reassignVariables(f, component))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }
    }

    const reassignVariables = (func: Function, component: Component) => {
        showSnackbar('Function added', SnackbarType.SUCCESS)
        _setFunctions([..._functions,func])
        _setFunctionsAndComponents([..._functionsAndComponents.filter((e) => e[0].iri != func.iri), [func, component]]);     
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
                _setFunctionsAndComponents([..._functionsAndComponents.filter((e) => e[0].iri != f.iri), [f,null]]);     
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

    const getTransitiveClosure = async (functionUri: string, type: string) => {
        return functionService.getTransitiveClosure(functionUri,type)
        .then(value => value)
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
        <functionsContext.Provider
            value={[
                _functions,
                addFunction,
                editFunction,
                removeFunction,
                addRequiredFunction,
                _allFunctions,
                _functionsAndComponents,
                generateFDTree,
                getFailureModes,
                getTransitiveClosure,
                addExistingFunction
            ]}
        >
            {children}
        </functionsContext.Provider>
    );
}