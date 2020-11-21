import * as React from "react";
import {useState} from "react";
import {cloneDeep, concat, flatten, filter, findIndex} from "lodash";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import PngExporter, {PngExportData} from "@components/editor/faultTree/tools/PngExporter";

import {useCurrentSystem} from "@hooks/useCurrentSystem";
import {Component} from "@models/componentModel";
import EditorCanvas from "./canvas/EditorCanvas";
import {useLocalContext} from "@hooks/useLocalContext";
import ComponentContextMenu from "./menu/ComponentContextMenu";
import {contextMenuDefaultAnchor, ElementContextMenuAnchor} from "../contextMenuUtils";
import ComponentDialog from "@components/dialog/component/ComponentDialog";

const Editor = () => {
    const [requestConfirmation] = useConfirmDialog()

    const [system, updateSystem] = useCurrentSystem()
    const _localContext = useLocalContext({system})

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

    const [componentDialogOpen, setComponentDialogOpen] = useState(false);
    const handleComponentCreated = (newComponent: Component) => {
        // @ts-ignore
        const systemClone = cloneDeep(_localContext.system);

        systemClone.components = concat(flatten([systemClone.components]), newComponent);
        updateSystem(systemClone);
    }

    const handleComponentUpdate = (componentToUpdate: Component) => {
        // @ts-ignore
        const systemClone = cloneDeep(_localContext.system);

        const index = findIndex(flatten([systemClone.components]), el => el.iri === componentToUpdate.iri);
        systemClone.components.splice(index, 1, componentToUpdate);

        updateSystem(systemClone);
    }

    const handleComponentDelete = (componentToDelete: Component) => {
        const deleteComponent = () => {
            // @ts-ignore
            const systemClone = cloneDeep(_localContext.system);

            systemClone.components = filter(flatten([systemClone.components]), (o) => o.iri !== componentToDelete.iri)
            updateSystem(systemClone);
        }

        requestConfirmation({
            title: 'Delete Component',
            explanation: 'Deleting the component will delete all associated functions and failure modes. Are you sure?',
            onConfirm: deleteComponent,
        })
    }

    const [exportData, setExportData] = useState<PngExportData>();

    return (
        <React.Fragment>
            <EditorCanvas
                system={system}
                exportImage={(encodedData) => setExportData(encodedData)}
                onComponentUpdated={handleComponentUpdate}
                sidebarSelectedComponent={sidebarSelectedComponent}
                onBlankContextMenu={handleBlankContextMenu}
                onElementContextMenu={handleContextMenu}
            />

            <ComponentContextMenu
                anchorPosition={contextMenuAnchor}
                onComponentCreate={() => setComponentDialogOpen(true)}
                onEditClick={() => setSidebarSelectedComponent(contextMenuSelectedComponent)}
                onComponentDelete={() => handleComponentDelete(contextMenuSelectedComponent)}
                onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}
                createOnly={!Boolean(contextMenuSelectedComponent)}
            />

            <ComponentDialog open={componentDialogOpen}
                             onCreated={handleComponentCreated}
                             onClose={() => setComponentDialogOpen(false)}/>

            {exportData && <PngExporter open={Boolean(exportData)} exportData={exportData}
                                        onClose={() => setExportData(null)}/>}
        </React.Fragment>
    );
}

export default Editor;