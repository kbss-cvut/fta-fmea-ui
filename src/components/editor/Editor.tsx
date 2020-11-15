import * as React from "react";
import {useEffect, useState} from "react";
import {cloneDeep, concat, flatten, assign, filter} from "lodash";
import EditorCanvas from "@components/editor/canvas/EditorCanvas";
import {findNodeByIri, findNodeParentByIri} from "@utils/treeUtils";
import {TreeNode} from "@models/treeNodeModel";
import ElementContextMenu, {
    contextMenuDefaultAnchor,
    ElementContextMenuAnchor
} from "@components/editor/menu/ElementContextMenu";
import {useLocalContext} from "@hooks/useLocalContext";
import * as treeNodeService from "@services/treeNodeService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {useCurrentFaultTree} from "@hooks/useCurrentFaultTree";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import FaultEventDialog from "@components/dialog/faultEvent/FaultEventDialog";

interface Props {
    exportImage: (string) => void
}

const Editor = ({exportImage}: Props) => {
    // TODO offer image export
    const [showSnackbar] = useSnackbar()
    const [requestConfirmation] = useConfirmDialog()

    const [faultTree, updateFaultTree] = useCurrentFaultTree()
    const [rootNode, setRootNode] = useState<TreeNode>()
    const _localContext = useLocalContext({rootNode})

    useEffect(() => {
        if (faultTree) {
            setRootNode(faultTree.manifestingNode)
        }
    }, [faultTree])

    const [contextMenuSelectedNode, setContextMenuSelectedNode] = useState<TreeNode>(null)
    const [sidebarSelectedNode, setSidebarSelectedNode] = useState<TreeNode>(null)

    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor)
    const handleContextMenu = (elementView, evt) => {
        const elementIri = elementView.model.get('custom/nodeIri');
        // @ts-ignore
        const foundNode = findNodeByIri(elementIri, _localContext.rootNode);
        setContextMenuSelectedNode(foundNode);
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const handleEventCreated = (newNode: TreeNode) => {
        // @ts-ignore
        const rootNodeClone = cloneDeep(_localContext.rootNode);

        const node = findNodeByIri(contextMenuSelectedNode.iri, rootNodeClone);
        node.children = concat(flatten([node.children]), newNode)

        // propagate changes locally in the app
        faultTree.manifestingNode = rootNodeClone
        updateFaultTree(faultTree)
        setRootNode(rootNodeClone)
    }

    const handleNodeUpdate = (nodeToUpdate: TreeNode) => {
        console.log(`handleNodeUpdate - ${nodeToUpdate.iri}`)
        treeNodeService.updateNode(nodeToUpdate)
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

    const handleNodeDelete = (nodeToDelete: TreeNode) => {
        const deleteNode = () => {
            treeNodeService.remove(nodeToDelete.iri)
                .then(value => {
                    // @ts-ignore
                    const rootNodeClone = cloneDeep(_localContext.rootNode);

                    if (rootNodeClone.iri === nodeToDelete.iri) {
                        // TODO how delete root node? Is it allowed?
                        console.log('Removing top event node')
                    } else {
                        const parent = findNodeParentByIri(nodeToDelete.iri, rootNodeClone);
                        parent.children = filter(flatten([parent.children]), (o) => o.iri !== nodeToDelete.iri)
                    }

                    // propagate changes locally in the app
                    faultTree.manifestingNode = rootNodeClone
                    updateFaultTree(faultTree)
                    setRootNode(rootNodeClone)
                })
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        requestConfirmation({
            title: 'Delete node',
            explanation: 'Deleting the node will delete all its subnodes. Are you sure?',
            onConfirm: deleteNode,
        })
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
                eventType={contextMenuSelectedNode?.event?.eventType}
                anchorPosition={contextMenuAnchor}
                onEditClick={() => setSidebarSelectedNode(contextMenuSelectedNode)}
                onNewEventClick={() => setEventDialogOpen(true)}
                onEventDelete={() => handleNodeDelete(contextMenuSelectedNode)}
                onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}/>


            <FaultEventDialog open={eventDialogOpen} nodeIri={contextMenuSelectedNode?.iri}
                              onCreated={handleEventCreated}
                              onClose={() => setEventDialogOpen(false)}/>
        </React.Fragment>
    );
}

export default Editor;