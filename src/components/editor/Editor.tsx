import * as React from "react";
import {useEffect, useState} from "react";
import {cloneDeep, concat, flatten, assign} from "lodash";
import EditorCanvas from "@components/editor/canvas/EditorCanvas";
import {findNodeByIri} from "@utils/treeUtils";
import {Event} from "@models/eventModel";
import {TreeNode} from "@models/treeNodeModel";
import ElementContextMenu, {ElementContextMenuAnchor} from "@components/editor/menu/ElementContextMenu";
import EventDialog from "@components/dialog/EventDialog";
import {useLocalContext} from "@hooks/useLocalContext";
import * as eventService from "@services/eventService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {useCurrentFaultTree} from "@hooks/useCurrentFaultTree";

interface Props {
    exportImage: (string) => void
}

const Editor = ({exportImage}: Props) => {
    // TODO offer image export
    const [showSnackbar] = useSnackbar()

    const [faultTree, updateFaultTree] = useCurrentFaultTree()
    const [rootNode, setRootNode] = useState<TreeNode<Event>>()
    const _localContext = useLocalContext({rootNode})

    useEffect(() => {
        if (faultTree) {
            setRootNode(faultTree.manifestingNode)
        }
    }, [faultTree])

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
        const rootNodeClone = cloneDeep(_localContext.rootNode);

        const node = findNodeByIri(contextMenuSelectedNode.iri, rootNodeClone);
        node.children = concat(flatten([node.children]), newNode)

        // propagate changes locally in the app
        faultTree.manifestingNode = rootNodeClone
        updateFaultTree(faultTree)
        setRootNode(rootNodeClone)
    }

    const handleNodeUpdate = (nodeToUpdate: TreeNode<Event>) => {
        console.log(`handleNodeUpdate - ${nodeToUpdate.iri}`)
        eventService.updateNode(nodeToUpdate)
            .then(value => {
                // @ts-ignore
                const rootNodeClone = cloneDeep(_localContext.rootNode);

                const foundNode = findNodeByIri(nodeToUpdate.iri, rootNodeClone);
                assign(foundNode, nodeToUpdate)

                // propagate changes locally in the app
                faultTree.manifestingNode = rootNodeClone
                updateFaultTree(faultTree)
                setRootNode(rootNodeClone)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    return (
        <React.Fragment>
            <EditorCanvas
                rootNode={rootNode}
                exportImage={exportImage}
                onNodeUpdated={handleNodeUpdate}
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