import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {CreateFunction, Function} from "@models/functionModel";
import * as componentService from "@services/componentService"
import * as functionService from "@services/functionService"
import {axiosSource} from "@services/utils/axiosUtils";
import {SnackbarType, useSnackbar} from "./useSnackbar";
import {filter} from "lodash";


type functionContextType = [
    Function[],
    (f: CreateFunction) => Promise<any>,
    (funcToDelete: Function) => void,
    (functionUri: string, requiredFunctionUri: string) => void,
    Function[]
];

export const functionsContext = createContext<functionContextType>(null!);

export const useFunctions = () => {
    const [functions, addFunction, deleteFunction, addRequiredFunction, allFunctions] = useContext(functionsContext);
    return [functions, addFunction, deleteFunction, addRequiredFunction, allFunctions] as const;
}

type FunctionProviderProps = {
    children: React.ReactNode,
    componentUri: string
};

export const FunctionsProvider = ({children, componentUri}: FunctionProviderProps) => {
    const [_functions, _setFunctions] = useState<Function[]>([]);
    const [_allFunctions, _setAllFunctions] = useState<Function[]>([]);
    const [showSnackbar] = useSnackbar()

    const addFunction = async (f: CreateFunction) => {
        return componentService.addFunction(componentUri, f)
            .then(value => {
                _setFunctions([..._functions, value])
                showSnackbar('Function created', SnackbarType.SUCCESS)
                return value
            }).catch(reason => showSnackbar(reason, SnackbarType.ERROR))
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
                .then(value => _setAllFunctions(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))

        }

        fetchFunctions()
        fetchAllFunctions()
        return () => axiosSource.cancel("FunctionsProvider - unmounting")
    }, [componentUri]);

    return (
        <functionsContext.Provider value={[_functions, addFunction, removeFunction,addRequiredFunction, _allFunctions]}>
            {children}
        </functionsContext.Provider>
    );
}