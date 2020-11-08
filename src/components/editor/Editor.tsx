import * as React from "react";
import {useEffect, useState} from "react";
import * as _ from "lodash";
import EditorCanvas from "@components/editor/canvas/EditorCanvas";
import {findNodeByIri} from "@utils/treeUtils";
import {Event} from "@models/eventModel";
import {TreeNode} from "@models/treeNodeModel";
import ElementContextMenu, {ElementContextMenuAnchor} from "@components/editor/menu/ElementContextMenu";
import EventDialog from "@components/dialog/EventDialog";
import {useLocalContext} from "@hooks/useLocalContext";
import {useCurrentFailureMode} from "@hooks/useCurrentFailureMode";


interface Props {
    exportImage: (string) => void
}

const Editor = ({exportImage}: Props) => {
    // TODO offer image export

    const [failureMode, updateFailureMode] = useCurrentFailureMode()
    const [rootNode, setRootNode] = useState<TreeNode<Event>>()
    const _localContext = useLocalContext({rootNode})

    useEffect(() => {
        if (failureMode) {
            setRootNode(failureMode.manifestingNode)
        }
    }, [failureMode])

    const [contextMenuSelectedNode, setContextMenuSelectedNode] = useState<TreeNode<Event>>(null)
    const [sidebarSelectedNode, setSidebarSelectedNode] = useState<TreeNode<Event>>(null)

    const contextMenuDefault = {mouseX: null, mouseY: null,} as ElementContextMenuAnchor;
    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefault)
    const handleContextMenu = (elementView, evt) => {
        const elementIri = elementView.model.get('custom/nodeIri');
        // @ts-ignore
        const foundNode = findNodeByIri(elementIri, _localContext.rootNode);
        setContextMenuSelectedNode(foundNode);
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const handleEventCreated = (newNode: TreeNode<Event>) => {
        // @ts-ignore
        const rootNodeClone = _.cloneDeep(_localContext.rootNode);

        const node = findNodeByIri(contextMenuSelectedNode.iri, rootNodeClone);
        node.children = _.concat(_.flatten([node.children]), newNode)

        // propagate changes locally in the app
        failureMode.manifestingNode = rootNodeClone
        updateFailureMode(failureMode)

        setRootNode(rootNodeClone)
    }

    return (
        <React.Fragment>
            <EditorCanvas
                rootNode={rootNode}
                exportImage={exportImage}
                sidebarSelectedNode={sidebarSelectedNode}
                onElementContextMenu={handleContextMenu}
            />

            <ElementContextMenu
                anchorPosition={contextMenuAnchor}
                eventType={contextMenuSelectedNode?.nodeType}
                onEditClick={() => setSidebarSelectedNode(contextMenuSelectedNode)}
                onNewEventClick={() => setEventDialogOpen(true)}
                onClose={() => setContextMenuAnchor(contextMenuDefault)}/>

            <EventDialog open={eventDialogOpen} nodeIri={contextMenuSelectedNode?.iri}
                         nodeType={contextMenuSelectedNode?.nodeType}
                         onCreated={handleEventCreated}
                         onClose={() => setEventDialogOpen(false)}/>

        </React.Fragment>
    );
}

export default Editor;