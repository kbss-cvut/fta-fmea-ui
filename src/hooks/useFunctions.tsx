import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";

import {CreateFunction, Function} from "@models/functionModel";
import * as componentService from "@services/componentService"
import {axiosSource} from "@services/utils/axiosUtils";


type functionContextType = [Function[], (f: CreateFunction) => void];

export const functionsContext = createContext<functionContextType>(null!);

export const useFunctions = () => {
    const [functions, addFunction] = useContext(functionsContext);
    return [functions, addFunction] as const;
}

type FunctionProviderProps = {
    children: React.ReactNode,
    componentUri: string
};

export const FunctionsProvider = ({children, componentUri}: FunctionProviderProps) => {
    const [_function, _setFunction] = useState<Function[]>([]);

    const addFunction = async (f: CreateFunction) => {
        const newFunction = await componentService.addFunction(componentUri, f);
        _setFunction([..._function, newFunction])
    }

    useEffect(() => {
        const fetchFunctions = async () => {
            if(componentUri) {
                const functions = await componentService.functions(componentUri);
                console.log(functions)
                _setFunction(functions)
            }
        }

        fetchFunctions()

        return () => {axiosSource.cancel("FunctionsProvider - unmounting")}
    }, [componentUri]);

    return (
        <functionsContext.Provider value={[_function, addFunction]}>
            {children}
        </functionsContext.Provider>
    );
}