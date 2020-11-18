import * as React from "react";
import {createContext, useContext, useEffect, useState} from "react";
import {FaultTree} from "@models/faultTreeModel";
import {ChildrenProps} from "@utils/hookUtils";
import {useFaultTrees} from "@hooks/useFaultTrees";
import * as _ from "lodash";
import {STORAGE_KEYS} from "@utils/constants";

export interface FaultTreeTab {
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

const saveLastOpenTabs = (tabs: FaultTreeTab[]) => {
    const lastOpenIris = tabs.filter(t => t.open).map(t => t.data.iri)
    saveLastOpenTabsIris(lastOpenIris)
}

export const saveLastOpenTabsIris = (lastOpenIris: string[]) => {
    localStorage.setItem(STORAGE_KEYS.LAST_OPEN_TABS, JSON.stringify(lastOpenIris));
}

export const getLastOpenTabsIris = (): string[] => {
    const items = localStorage.getItem(STORAGE_KEYS.LAST_OPEN_TABS)
    if(items) {
        return JSON.parse(items);
    } else {
        return [];
    }
}


export const OpenTabsProvider = ({children}: ChildrenProps) => {
    const [faultTrees] = useFaultTrees()

    const [_tabs, _setOpenTabs] = useState<FaultTreeTab[]>([]);
    const [currentTabIri, setCurrentTabIri] = useState<string | null>(null);
    useEffect(() => {
        const lastTabsMap = new Map<string, boolean>();
        getLastOpenTabsIris().forEach(tabTri => lastTabsMap.set(tabTri, true))

        const faultTreesTabs = faultTrees.map(mode => {
            return {
                open: lastTabsMap.has(mode.iri),
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
            saveLastOpenTabs(tabsClone)
        }
    }

    const closeTab = (treeToClose: FaultTree) => {
        const index = _.findIndex(_tabs, (o: FaultTreeTab) => o.data.iri === treeToClose.iri);

        if (_tabs[index].open) {
            const tabsClone = _.cloneDeep(_tabs)
            tabsClone[index] = {open: false, data: treeToClose}
            _setOpenTabs(tabsClone)
            setCurrentTabIri(null)
            saveLastOpenTabs(tabsClone)
        }
    }


    return (
        <openTabsContext.Provider value={[_tabs, openTab, closeTab, currentTabIri]}>
            {children}
        </openTabsContext.Provider>
    );
}