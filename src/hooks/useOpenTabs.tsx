import * as React from "react";
import {createContext, useContext, useState} from "react";
import {FailureMode} from "@models/failureModeModel";
import {ChildrenProps} from "@utils/hookUtils";


type openTabsContextType = [FailureMode[], (failureMode: FailureMode) => void];

export const openTabsContext = createContext<openTabsContextType>(null!);

export const useOpenTabs = () => {
    const [tabs, openTab] = useContext(openTabsContext);
    return [tabs, openTab] as const;
}

export const OpenTabsProvider = ({children}: ChildrenProps) => {
    const [_tabs, _openTab] = useState<FailureMode[]>([]);

    const openTab = (failureMode: FailureMode) => {
        if (!_tabs.includes(failureMode)) {
            _openTab([..._tabs, failureMode])
        }
    }

    return (
        <openTabsContext.Provider value={[_tabs, openTab]}>
            {children}
        </openTabsContext.Provider>
    );
}