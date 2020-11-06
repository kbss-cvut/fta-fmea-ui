import * as React from "react";
import {FailureMode} from "@models/failureModeModel";
import {useSnackbar} from "@hooks/useSnackbar";
import EditorCanvas from "@components/editor/canvas/EditorCanvas";
import {findNodeByIri} from "@utils/treeUtils";
import {Event} from "@models/eventModel";
import {TreeNode} from "@models/treeNodeModel";
import {useState} from "react";
import ElementContextMenu, {ElementContextMenuAnchor} from "@components/editor/menu/ElementContextMenu";


interface EditorPros {
    failureMode: FailureMode,
    exportImage: (string) => void
}

const Editor = ({failureMode, exportImage}: EditorPros) => {
    const [showSnackbar] = useSnackbar()

    // TODO Example how to update the data:
    // const elementIri = elementView.model.get('custom/nodeIri');
    // const node = findNodeByIri(elementIri, rootNodeClone);
    // (node.event as FaultEvent).name = 'CHanged Name!!!';
    // setRootNode(rootNodeClone)

    // TODO offer image export
    const [rootNode, setRootNode] = useState<TreeNode<Event>>(failureMode.manifestingNode)
    const [selectedEvent, setSelectedEvent] = useState<TreeNode<Event>>(null)

    const contextMenuDefault = {mouseX: null, mouseY: null,} as ElementContextMenuAnchor;
    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefault)
    const handleContextMenu = (elementView, evt, rootNodeClone: TreeNode<Event>) => {
        const elementIri = elementView.model.get('custom/nodeIri');
        setSelectedEvent(findNodeByIri(elementIri, rootNodeClone));
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    return (
        <React.Fragment>
            <EditorCanvas
                rootNode={rootNode}
                exportImage={exportImage}
                onElementContextMenu={handleContextMenu}
            />

            <ElementContextMenu
                anchorPosition={contextMenuAnchor}
                eventType={selectedEvent?.nodeType}
                onEditClick={() => console.log(`onEditClick - ${selectedEvent.iri}`)}
                onNewEventClick={() => console.log(`onNewEventClick - ${selectedEvent.iri}`)}
                onClose={() => setContextMenuAnchor(contextMenuDefault)}/>
        </React.Fragment>
    );
}

export default Editor;