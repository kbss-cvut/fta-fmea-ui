import * as React from "react";
import {FailureMode} from "@models/failureModeModel";
import {useSnackbar} from "@hooks/useSnackbar";
import EditorCanvas from "@components/editor/canvas/EditorCanvas";
import {findNodeByIri} from "@utils/treeUtils";
import {Event, FaultEvent} from "@models/eventModel";
import {TreeNode} from "@models/treeNodeModel";
import {useState} from "react";
import ElementContextMenu, {ElementContextMenuAnchor} from "@components/editor/menu/ElementContextMenu";
import EventDialog from "@components/dialog/EventDialog";
import * as _ from "lodash";
import {useLocalContext} from "@hooks/useLocalContext";


interface Props {
    failureMode: FailureMode,
    exportImage: (string) => void
}

const Editor = ({failureMode, exportImage}: Props) => {
    // TODO offer image export

    const [rootNode, setRootNode] = useState<TreeNode<Event>>(failureMode.manifestingNode)
    const _localContext = useLocalContext({rootNode})

    const [selectedNode, setSelectedNode] = useState<TreeNode<Event>>(null)

    const contextMenuDefault = {mouseX: null, mouseY: null,} as ElementContextMenuAnchor;
    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefault)
    const handleContextMenu = (elementView, evt) => {
        const elementIri = elementView.model.get('custom/nodeIri');
        // @ts-ignore
        const foundNode = findNodeByIri(elementIri, _localContext.rootNode);
        setSelectedNode(foundNode);
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const handleEventCreated = (newNode: TreeNode<Event>) => {
        console.log(`handleEventCreated - ${newNode.iri}`)
        // @ts-ignore
        const rootNodeClone = _.cloneDeep(_localContext.rootNode);

        const node = findNodeByIri(selectedNode.iri, rootNodeClone);
        node.children.push(newNode)
        setRootNode(rootNodeClone)
        console.log(rootNodeClone)
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
                eventType={selectedNode?.nodeType}
                onEditClick={() => console.log(`onEditClick - ${selectedNode.iri}`)}
                onNewEventClick={() => setEventDialogOpen(true)}
                onClose={() => setContextMenuAnchor(contextMenuDefault)}/>

            <EventDialog open={eventDialogOpen} nodeIri={selectedNode?.iri} nodeType={selectedNode?.nodeType}
                         onCreated={handleEventCreated}
                         onClose={() => setEventDialogOpen(false)}/>

        </React.Fragment>
    );
}

export default Editor;