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

type openTabsContextType = [FailureModeTab[], (failureMode: FailureMode) => void, (failureMode: FailureMode) => void];

export const openTabsContext = createContext<openTabsContextType>(null!);

export const useOpenTabs = () => {
    const [tabs, openTab, closeTab] = useContext(openTabsContext);
    return [tabs, openTab, closeTab] as const;
}

export const OpenTabsProvider = ({children}: ChildrenProps) => {
    const [failureModes] = useFailureModes()

    const [_tabs, _setOpenTabs] = useState<FailureModeTab[]>([]);
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
        }
    }

    const closeTab = (modeToClose: FailureMode) => {
        const index = _.findIndex(_tabs, (o: FailureModeTab) => o.data.iri === modeToClose.iri);

        if (_tabs[index].open) {
            const tabsClone = _.cloneDeep(_tabs)
            tabsClone[index] = {open: false, data: modeToClose}
            _setOpenTabs(tabsClone)
        }
    }


    return (
        <openTabsContext.Provider value={[_tabs, openTab, closeTab]}>
            {children}
        </openTabsContext.Provider>
    );
}