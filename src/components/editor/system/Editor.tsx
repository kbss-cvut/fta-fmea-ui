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

    const [system, addComponent, updateComponent, removeComponent, fetchSystem] = useCurrentSystem()

    const [highlightedElementView, setHighlightedElementView] = useState(null)
    const _localContext = useLocalContext({system: system, highlightedElementView: highlightedElementView})
    const [mergeableComponents, setMergeableComponents] = useState(false)

    useEffect(() => {
        setAppBarName(system?.name);
    })
    useEffect(() => {
        if (highlightedElementView) {
            highlightBorders(highlightedElementView);
        }
    }, [highlightedElementView])

    const [contextMenuSelectedComponent, setContextMenuSelectedComponent] = useState<Component>(null)
    const [sidebarSelectedComponent, setSidebarSelectedComponent] = useState<Component>(null)
    const [showConfirmDialog] = useConfirmDialog();

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
    }

    useEffect(() => {
        setMergeableComponents( sidebarSelectedComponent
            && contextMenuSelectedComponent && sidebarSelectedComponent.iri !== contextMenuSelectedComponent.iri)
    },[sidebarSelectedComponent, contextMenuSelectedComponent])

    const mergeComponents = () => {
        if (contextMenuSelectedComponent.linkedComponent
            && (!sidebarSelectedComponent.linkedComponent ||
                contextMenuSelectedComponent.linkedComponent && sidebarSelectedComponent.linkedComponent
                && sidebarSelectedComponent.linkedComponent.iri !== contextMenuSelectedComponent.linkedComponent.iri)
            ){
            showConfirmDialog({
                title: 'Merge components',
                explanation: 'Do you want to merge components? Parent component will be changed.',
                onConfirm: () => {
                    merge()
                },
            })
        }else merge()

    }
    const merge = () => {
        componentService.mergeComponents(sidebarSelectedComponent.iri, contextMenuSelectedComponent.iri)
            .then(() => {
                fetchSystem()
                setSidebarSelectedComponent(null)
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
                mergeComponents={mergeComponents}
                contextMenuSelectedComponent={contextMenuSelectedComponent}
                mergeable={mergeableComponents}
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