import * as React from "react";
import {useEffect, useState} from "react";
import {flatten, findIndex} from "lodash";
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
import * as joint from "jointjs";
import {FTABoundary} from "@components/editor/faultTree/shapes/shapesDefinitions";

const Editor = ({setAppBarName}: DashboardTitleProps) => {
    const [requestConfirmation] = useConfirmDialog()
    const [showSnackbar] = useSnackbar();

    const [system, addComponent, updateComponent, removeComponent] = useCurrentSystem()
    setAppBarName(system?.name);

    const [highlightedElementView, setHighlightedElementView] = useState(null)
    const _localContext = useLocalContext({system: system, highlightedElementView: highlightedElementView})

    useEffect(() => {
        if (highlightedElementView) {
            highlightBorders(highlightedElementView);
        }
    }, [highlightedElementView])

    const [contextMenuSelectedComponent, setContextMenuSelectedComponent] = useState<Component>(null)
    const [sidebarSelectedComponent, setSidebarSelectedComponent] = useState<Component>(null)

    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor)
    const handleBlankContextMenu = (evt) => {
        setContextMenuSelectedComponent(null);
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    const handleContextMenu = (elementView, evt) => {
        const componentIri = elementView.model.get('custom/componentIri');

        // @ts-ignore
        const flattenedComponents = flatten([_localContext.system.components]);
        const index = findIndex(flattenedComponents, el => el.iri === componentIri);
        if (index > -1) {
            setContextMenuSelectedComponent(flattenedComponents[index]);
            setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
        }
    }

    const handleElementPointerClick = (elementView) => {
        const componentIri = elementView.model.get('custom/componentIri');

        // @ts-ignore
        const flattenedComponents = flatten([_localContext.system.components]);
        const index = findIndex(flattenedComponents, el => el.iri === componentIri);
        if (index > -1) {
            setSidebarSelectedComponent(flattenedComponents[index]);
            setHighlightedElementView(elementView);
            highlightBorders(elementView);
        }
    }

    const handleBlankPointerClick = () => {
        setSidebarSelectedComponent(null);
        hideHighlightedBorders();
    }

    const highlightBorders = (elementView) => {
        const tools = new joint.dia.ToolsView({
            tools: [FTABoundary.factory()]
        });
        elementView.addTools(tools);
    }
    const hideHighlightedBorders = () => {
        // @ts-ignore
        _localContext.highlightedElementView?.removeTools();
        setHighlightedElementView(null);
    }

    const [componentDialogOpen, setComponentDialogOpen] = useState(false);
    const handleComponentCreated = (newComponent: Component) => {
        addComponent(newComponent);
    }

    const handleComponentUpdate = (componentToUpdate: Component) => {
        updateComponent(componentToUpdate);
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
    }

    return (
        <React.Fragment>
            <EditorCanvas
                system={system}
                onComponentUpdated={handleComponentUpdate}
                sidebarSelectedComponent={sidebarSelectedComponent}
                onBlankContextMenu={handleBlankContextMenu}
                onElementContextMenu={handleContextMenu}
                onBlankPointerClick={handleBlankPointerClick}
                onElementPointerClick={handleElementPointerClick}
                setHighlightedElement={setHighlightedElementView}/>

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