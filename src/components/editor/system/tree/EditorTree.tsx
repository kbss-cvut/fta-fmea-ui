import * as React from "react";
import {System} from "@models/systemModel";
import {Component} from "@models/componentModel";
import TreeItem from '@material-ui/lab/TreeItem';
import useStyles from "../../EditorCanvas.styles";
import {TreeView} from "@material-ui/lab";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ComponentSidebarMenu from "@components/editor/system/menu/component/ComponentSidebarMenu";
import SidebarMenu from "@components/editor/faultTree/menu/SidebarMenu";

interface Props {
    system: System,
    sidebarSelectedComponent: Component,
    onBlankContextMenu: (evt: any) => void,
    onElementContextMenu: (componentIri:string, element: any, evt: any) => void,
    onElementPointerClick: (componentIri:string, element: any, evt: any) => void,
    onBlankPointerClick: () => void,
    onComponentUpdated: (component: Component) => void,
    hide?: boolean
}

interface RenderTree {
    id: string,
    name: string,
    children?: RenderTree[]
}

const EditorTree = ({
                        system,
                        sidebarSelectedComponent,
                        onBlankContextMenu,
                        onElementContextMenu,
                        onElementPointerClick,
                        onBlankPointerClick,
                        onComponentUpdated,
                        hide
                      }: Props) => {
    const classes = useStyles();

    const [expanded, setExpanded] = React.useState<string[]>([]);


    // const isRightButton = (event) => {
    //     return event.button == 2;
    // }
    // const isElementLabel = (event: React.ChangeEvent<{}>) => {
    //     return event && pathFromHasClassWith(event.target, 'MuiTreeItem')
    // }
    // const isToggle = (event: React.ChangeEvent<{}>) => {
    //     return event && pathFromHasClassWith(event.target, 'iconContainer')
    // }
    // const pathFromHasClassWith = (fromElement, value) =>{
    //     let el = fromElement
    //     //@ts-ignore
    //     while(!el.className.includes && el.parentNode && el.parentNode.className) el = el.parentNode
    //     //@ts-ignore
    //     return el.className.includes(value)
    // }

    const getTreeItem = (event) => {
        let el = event.target
        while((!el.attributes.role || el.attributes.role.nodeValue != 'treeitem') && el.parentNode)
            el = el.parentNode
        return el;
    }

    const getComponent = (event) => {
        let treeItem = getTreeItem(event)
        return treeItem.attributes?.itemid?.nodeValue
    }

    let isToggleEvent;

    const disableToggleOnLabel = (event: React.ChangeEvent<{}>) => {
        isToggleEvent = false
        event.preventDefault()
    }

    const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
        isToggleEvent = true
        setExpanded(nodeIds)
    }

    const handleSelect = (event: React.ChangeEvent<{}>, nodeId: string) => {
        if(!isToggleEvent)
            onElementPointerClick(nodeId, null, event)
    };

    const map = new Map();
    if(system?.components) {
        let sysComps = system.components.filter((c) => (!c.linkedComponent))
        // debugger;
        map.set(system.iri, sysComps)
        system.components.filter((c) => (!!c.linkedComponent)).forEach((c) => {
            let parentChildren = map.get(c.linkedComponent.iri);
            if(!parentChildren) {
                parentChildren = []
                map.set(c.linkedComponent.iri, parentChildren)
            }
            parentChildren.push(c);
        })
    }

    const handleContextMenu = (evt) => {
        evt.preventDefault()
        let componentIri = getComponent(evt)
        onElementContextMenu(componentIri, null,evt)
    }

    const renderSystem = (system : System) => (
        <TreeItem key={system.iri} nodeId={system.iri} label={system.name}>
            {map.get(system.iri)?.map(c => renderComponent(c))}
        </TreeItem>
    );

    const renderComponent = (comp : Component) => (
        <TreeItem key={comp.iri} nodeId={comp.iri} itemID={comp.iri} label={comp.name} onContextMenu={handleContextMenu}  onLabelClick={disableToggleOnLabel}>
            {map.get(comp.iri)?.map(c => renderComponent(c))}
        </TreeItem>
    );

    let selected = sidebarSelectedComponent ? sidebarSelectedComponent.iri : ""
    return (<div className={hide ? classes.rootHidden : classes.root}>
            <TreeView
                id={'tree-system-container'}
                className={classes.treeContainer}
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={expanded}
                selected={selected}
                onNodeToggle={handleToggle}
                onNodeSelect={handleSelect}
                // onMouseDown={handleMouse}
                multiSelect={false}
            >
                {system && renderSystem(system)}
            </TreeView>
            <SidebarMenu className={classes.sidebar}>
                {system && <ComponentSidebarMenu
                    component={sidebarSelectedComponent}
                    onComponentUpdated={onComponentUpdated}
                    systemComponents={system.components}
                />
                }
            </SidebarMenu>
        </div>
    );
}

export default EditorTree;