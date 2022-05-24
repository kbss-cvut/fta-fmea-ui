import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {findIndex, flatten} from "lodash";
import {useConfirmDialog} from "@hooks/useConfirmDialog";

import {useCurrentSystem} from "@hooks/useCurrentSystem";
import {Component} from "@models/componentModel";
import EditorCanvas from "./canvas/EditorCanvas";
import {useLocalContext} from "@hooks/useLocalContext";
import ComponentContextMenu from "./menu/component/ComponentContextMenu";
import {contextMenuDefaultAnchor, ElementContextMenuAnchor} from "@utils/contextMenu";
import ComponentDialog from "@components/dialog/component/ComponentDialog";
import * as componentService from "@services/componentService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {DashboardTitleProps} from "@components/dashboard/DashboardTitleProps";
import {AppBar, Tab, Tabs} from "@material-ui/core";
import ComponentSidebarMenu from "@components/editor/system/menu/component/ComponentSidebarMenu";
import SidebarMenu from "@components/editor/faultTree/menu/SidebarMenu";
import useStyles from "@components/editor/EditorCanvas.styles";
import EditorTree from "@components/editor/system/tree/EditorTree";
import DiagramOptions from "@components/editor/menu/DiagramOptions";

const Editor = ({setAppBarName}: DashboardTitleProps) => {
    const classes = useStyles()
    const [requestConfirmation] = useConfirmDialog()
    const [showSnackbar] = useSnackbar();

    const [system, addComponent, updateComponent, removeComponent] = useCurrentSystem()
    const _localContext = useLocalContext({system: system})

    useEffect(() => {
        setAppBarName(system?.name);
    })

    const [contextMenuSelectedComponent, setContextMenuSelectedComponent] = useState<Component>(null)
    const [sidebarSelectedComponent, setSidebarSelectedComponent] = useState<Component>(null)

    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor)
    const handleBlankContextMenu = (evt) => {
        setContextMenuSelectedComponent(null);
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    const getComponent = (componentIri : string) => {
        // @ts-ignore
        const flattenedComponents =  flatten([_localContext.system.components]);
        const index = findIndex(flattenedComponents, el => el.iri === componentIri);
        return index > -1 ? flattenedComponents[index] : null
    }

    const handleContextMenu = (componentIri : string, elementView, evt) => {
        let component = getComponent(componentIri)
        if (component) {
            setContextMenuSelectedComponent(component);
            setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
        }
    }

    const handleElementPointerClick = (componentIri : string, elementView, evt) => {
        let component = getComponent(componentIri)
        if (component) {
            setSidebarSelectedComponent(component);
        }
    }

    const handleBlankPointerClick = () => {
        setSidebarSelectedComponent(null);
    }

    const [componentDialogOpen, setComponentDialogOpen] = useState(false);
    const handleComponentCreated = (newComponent: Component) => {
        addComponent(newComponent);
    }

    const handleComponentUpdate = (componentToUpdate: Component) => {
        updateComponent(componentToUpdate);
        setSidebarSelectedComponent(componentToUpdate);
    }

    const handleComponentDelete = (componentToDelete: Component) => {
        const deleteComponent = () => {
            setSidebarSelectedComponent(null);

            componentService.remove(componentToDelete.iri)
                .then(value => removeComponent(componentToDelete))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR));
        }

        requestConfirmation({
            title: 'Delete Component',
            explanation: 'Deleting the component will delete all associated functions and failure modes. Are you sure?',
            onConfirm: deleteComponent,
        })
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    };

    const [tab, setTab] = React.useState(0);
    const handleChange = (event, newTab) => {
        setTab(newTab);
    };

    return (
        <React.Fragment>
            <AppBar position="static">
                <Tabs value={tab} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="System Partonomy Diagram" {...a11yProps(0)} />
                    <Tab label="System Partonomy Tree" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <EditorCanvas
                system={system}
                sidebarSelectedComponent={sidebarSelectedComponent}
                onBlankContextMenu={handleBlankContextMenu}
                onElementContextMenu={handleContextMenu}
                onBlankPointerClick={handleBlankPointerClick}
                onElementPointerClick={handleElementPointerClick}
                onComponentUpdated={handleComponentUpdate}
                hide = {tab != 0}/>
            <EditorTree
                system={system}
                sidebarSelectedComponent={sidebarSelectedComponent}
                onBlankContextMenu={handleBlankContextMenu}
                onElementContextMenu={handleContextMenu}
                onBlankPointerClick={handleBlankPointerClick}
                onElementPointerClick={handleElementPointerClick}
                onComponentUpdated={handleComponentUpdate}
                hide={tab != 1}
            />
            <ComponentContextMenu
                anchorPosition={contextMenuAnchor}
                onComponentCreate={() => setComponentDialogOpen(true)}
                onComponentDelete={() => handleComponentDelete(contextMenuSelectedComponent)}
                onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}
                createOnly={!Boolean(contextMenuSelectedComponent)}
            />

            <ComponentDialog open={componentDialogOpen}
                             onCreated={handleComponentCreated}
                             onClose={() => setComponentDialogOpen(false)}/>
        </React.Fragment>
    );
}

export default Editor;