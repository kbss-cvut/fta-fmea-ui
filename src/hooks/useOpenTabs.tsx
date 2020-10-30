import * as React from "react";
import {createContext, useContext, useState} from "react";
import {FailureMode} from "@models/failureModeModel";
import {ChildrenProps} from "@utils/hookUtils";


type openTabsContextType = [FailureMode[], (failureMode: FailureMode) => void, (failureMode: FailureMode) => void];

export const openTabsContext = createContext<openTabsContextType>(null!);

export const useOpenTabs = () => {
    const [tabs, openTab, closeTab] = useContext(openTabsContext);
    return [tabs, openTab, closeTab] as const;
}

export const OpenTabsProvider = ({children}: ChildrenProps) => {
    const [_tabs, _setOpenTabs] = useState<FailureMode[]>([]);

    const openTab = (failureMode: FailureMode) => {
        if (!_tabs.includes(failureMode)) {
            _setOpenTabs([..._tabs, failureMode])
        }
    }

    const closeTab = (failureMode: FailureMode) => {
        const idx = _tabs.indexOf(failureMode);
        if (idx > -1) {
            const tabsCopy = [..._tabs]
            tabsCopy.splice(idx, 1);
            _setOpenTabs(tabsCopy)
        }
    }


    return (
        <openTabsContext.Provider value={[_tabs, openTab, closeTab]}>
            {children}
        </openTabsContext.Provider>
    );
}