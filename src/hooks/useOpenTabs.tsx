import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";
import {FaultTree} from "@models/faultTreeModel";
import {ChildrenProps} from "@utils/hookUtils";
import {useFaultTrees} from "@hooks/useFaultTrees";
import * as _ from "lodash";

interface FaultTreeTab {
    open: boolean,
    data: FaultTree,
    openTime: number
}

type openTabsContextType = [
    FaultTreeTab[],
    (faultTree: FaultTree) => void,
    (faultTree: FaultTree) => void,
    string,
];

export const openTabsContext = createContext<openTabsContextType>(null!);

export const useOpenTabs = () => {
    const [tabs, openTab, closeTab, currentTabIri] = useContext(openTabsContext);
    return [tabs, openTab, closeTab, currentTabIri] as const;
}

export const OpenTabsProvider = ({children}: ChildrenProps) => {
    const [faultTrees] = useFaultTrees()

    const [_tabs, _setOpenTabs] = useState<FaultTreeTab[]>([]);
    const [currentTabIri, setCurrentTabIri] = useState<string | null>(null);
    useEffect(() => {
        const faultTreesTabs = faultTrees.map(mode => {
            return {
                open: false,
                data: mode,
                openTime: Date.now()
            }
        })
        _setOpenTabs(faultTreesTabs);
    }, [faultTrees])

    const openTab = (treeToOpen: FaultTree) => {
        const index = _.findIndex(_tabs, (o: FaultTreeTab) => o.data.iri === treeToOpen.iri);

        if (!_tabs[index].open) {
            const tabsClone = _.cloneDeep(_tabs)
            tabsClone[index] = {open: true, data: treeToOpen, openTime: Date.now()}
            _setOpenTabs(tabsClone)
            setCurrentTabIri(treeToOpen.iri)
        }
    }

    const closeTab = (treeToClose: FaultTree) => {
        const index = _.findIndex(_tabs, (o: FaultTreeTab) => o.data.iri === treeToClose.iri);

        if (_tabs[index].open) {
            const tabsClone = _.cloneDeep(_tabs)
            tabsClone[index] = {open: false, data: treeToClose}
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