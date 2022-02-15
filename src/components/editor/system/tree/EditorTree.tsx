import {useEffect, useRef, useState} from "react";
import * as React from "react";
// import useStyles from "../../EditorCanvas.styles";
import * as joint from 'jointjs';
import * as dagre from 'dagre';
import * as graphlib from 'graphlib';
import * as ModelUtils from "@models/utils/ModelUtils";
import {System} from "@models/systemModel";
import {Component} from "@models/componentModel";
// import {flatten, findIndex, cloneDeep} from "lodash";
import ComponentShape from "@components/editor/system/shapes/ComponentShape";
import DiagramOptions from "@components/editor/menu/DiagramOptions";
import SidebarMenu from "@components/editor/faultTree/menu/SidebarMenu";
import ComponentSidebarMenu from "@components/editor/system/menu/component/ComponentSidebarMenu";
import {SystemLink} from "@components/editor/system/shapes/shapesDefinitions";
import * as svgPanZoom from "svg-pan-zoom";
import {SVG_PAN_ZOOM_OPTIONS} from "@utils/constants";
import {saveSvgAsPng} from "save-svg-as-png";
import TreeItem from '@material-ui/lab/TreeItem';
import useStyles from "../../EditorCanvas.styles";
import {TreeView} from "@material-ui/lab";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {contextMenuDefaultAnchor, ElementContextMenuAnchor} from "@utils/contextMenu";
import ComponentContextMenu from "@components/editor/system/menu/component/ComponentContextMenu";
import ComponentDialog from "@components/dialog/component/ComponentDialog";
import {useCurrentSystem} from "@hooks/useCurrentSystem";
import * as componentService from "@services/componentService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import * as StateUtils from "@utils/StateUtils";

interface Props {
    system: System,
    // getSidebarSelectedComponent: () => Component,
    onBlankContextMenu: (evt: any) => void,
    onElementContextMenu: (element: any, evt: any) => void,
    // setSidebarSelectedComponent: (element: any, onSuccess? : () => void) => void,
    onBlankPointerClick: () => void,
    onComponentUpdated: (component: Component) => void,
    setHighlightedElement: (element: any) => void,
}

interface RenderTree {
    id: string;
    name: string;
    children?: RenderTree[];
}

// const EditorTree = ({
//                           system,
//                           sidebarSelectedComponent,
//                           onBlankContextMenu,
//                           onElementContextMenu,
//                           onElementPointerClick,
//                           onBlankPointerClick,
//                           onComponentUpdated,
//                           setHighlightedElement
//                       }: Props) => {

// const data: RenderTree = {
//     id: 'root',
//     name: 'Parent',
//     children: [
//         {
//             id: '1',
//             name: 'Child - 1',
//         },
//         {
//             id: '3',
//             name: 'Child - 3',
//             children: [
//                 {
//                     id: '4',
//                     name: 'Child - 4',
//                 },
//             ],
//         },
//     ],
// };
// const useStyles = makeStyles({
//     root: {
//         height: 110,
//         flexGrow: 1,
//         maxWidth: 400,
//     },
// });
var stateExtension;
const EditorTree = ({
                          system,
                          // getSidebarSelectedComponent,
                          onBlankContextMenu,
                          onElementContextMenu,
                          // setSidebarSelectedComponent,
                          onBlankPointerClick,
                          onComponentUpdated,
                          setHighlightedElement
                      }: Props) => {
// const EditorTree = ({system} : Props) => {
// const EditorTree = () => {
    const classes = useStyles();
    // const [system, addComponent, updateComponent, removeComponent] = useCurrentSystem()
    stateExtension = StateUtils.createExtendedState(stateExtension,[], system, s => s.iri )

    const [expanded, setExpanded] = React.useState<string[]>(stateExtension.state);
    const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
        stateExtension.state = nodeIds;
        setExpanded(nodeIds);
    };

    const [selected, setSelected] = React.useState<string[]>([]);
    const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
        setSelected(nodeIds);
        // const nodeId =  nodeIds ? ( Array.isArray(nodeIds) ? nodeIds?.[0] : nodeIds) : ""
        // if(typeof nodeId === 'string')
        //     setSidebarSelectedComponent(nodeId)
    };

    const getSelectedComponent = () => {
        const nodeId =  selected ? ( Array.isArray(selected) ? selected?.[0] : selected) : ""
        return typeof nodeId === 'string' ? ModelUtils.findByIri(nodeId, system.components) : null;
    }
    // const getComponent = (iri : string) => {
    //     // @ts-ignore
    //     const flattenedComponents = flatten([system.components]);
    //     const index = findIndex(flattenedComponents, el => el.iri === iri);
    //     return index > -1 ? flattenedComponents[index] : null;
    // };


    const map = new Map();
    if(system!.components) {
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


    const renderTree = (nodes: RenderTree) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
            {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
        </TreeItem>
    );

    const renderSystem = (system : System) => (
        <TreeItem key={system.iri} nodeId={system.iri} label={system.name}>
            {map.get(system.iri)?.map(c => renderComponent(c))}
        </TreeItem>
    );

    const handleMouse = (evt) => {
        console.log(evt)
    };


    //
    const renderComponent = (comp : Component) => (
        // comp.linkedComponent
        <TreeItem key={comp.iri} nodeId={comp.iri} label={comp.name}>
            {map.get(comp.iri)?.map(c => renderComponent(c))}
        </TreeItem>
    );

    return (<div className={classes.root}>
            <TreeView
                className={classes.konvaContainer}
                defaultCollapseIcon={<ExpandMoreIcon />}
                // defaultExpanded={['root']}
                defaultExpandIcon={<ChevronRightIcon />}
                expanded={expanded}
                selected={selected}
                onNodeToggle={handleToggle}
                onNodeSelect={handleSelect}
                onMouseDown={handleMouse}
            >
                {/*{renderTree(data)}*/}
                {renderSystem(system)}
            </TreeView>
            <SidebarMenu className={classes.sidebar}>
                {system && <ComponentSidebarMenu
                    component={getSelectedComponent()}
                    onComponentUpdated={onComponentUpdated}
                    systemComponents={system?.components}
                />}
            </SidebarMenu>
        </div>
    );

}

export default EditorTree;