import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";
import {FailureMode} from "@models/failureModeModel";
import {ChildrenProps} from "@utils/hookUtils";
import {useFailureModes} from "@hooks/useFailureModes";
import * as _ from "lodash";

interface FailureModeTab {
    open: boolean,
    data: FailureMode,
    openTime: number
}

type openTabsContextType = [
    FailureModeTab[],
    (failureMode: FailureMode) => void,
    (failureMode: FailureMode) => void,
    string,
];

export const openTabsContext = createContext<openTabsContextType>(null!);

export const useOpenTabs = () => {
    const [tabs, openTab, closeTab, currentTabIri] = useContext(openTabsContext);
    return [tabs, openTab, closeTab, currentTabIri] as const;
}

export const OpenTabsProvider = ({children}: ChildrenProps) => {
    const [failureModes] = useFailureModes()

    const [_tabs, _setOpenTabs] = useState<FailureModeTab[]>([]);
    const [currentTabIri, setCurrentTabIri] = useState<string | null>(null);
    useEffect(() => {
        const failureModeTabs = failureModes.map(mode => {
            return {
                open: false,
                data: mode,
                openTime: Date.now()
            }
        })
        _setOpenTabs(failureModeTabs);
    }, [failureModes])

    const openTab = (modeToOpen: FailureMode) => {
        const index = _.findIndex(_tabs, (o: FailureModeTab) => o.data.iri === modeToOpen.iri);

        if (!_tabs[index].open) {
            const tabsClone = _.cloneDeep(_tabs)
            tabsClone[index] = {open: true, data: modeToOpen, openTime: Date.now()}
            _setOpenTabs(tabsClone)
            setCurrentTabIri(modeToOpen.iri)
        }
    }

    const closeTab = (modeToClose: FailureMode) => {
        const index = _.findIndex(_tabs, (o: FailureModeTab) => o.data.iri === modeToClose.iri);

        if (_tabs[index].open) {
            const tabsClone = _.cloneDeep(_tabs)
            tabsClone[index] = {open: false, data: modeToClose}
            _setOpenTabs(tabsClone)
            setCurrentTabIri(null)
        }
    }


    return (
        <openTabsContext.Provider value={[_tabs, openTab, closeTab, currentTabIri]}>
            {children}
        </openTabsContext.Provider>
    );
}