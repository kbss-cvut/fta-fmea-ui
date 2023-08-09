import {Menu, MenuItem} from "@mui/material";
import * as React from "react";
import {ElementContextMenuAnchor} from "@utils/contextMenu";
import ImportDocumentDialog from "@components/editor/system/menu/component/ImportDocumentDialog";
import {DocumentProvider} from "@hooks/useDocuments";
import {Component} from "@models/componentModel";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

interface Props {
    anchorPosition: ElementContextMenuAnchor,
    onComponentCreate: () => void,
    onComponentDelete: () => void,
    contextMenuSelectedComponent: Component,
    createOnly: boolean,
    onClose: () => void,
    mergeComponents: () => void,
    mergeable: boolean
}

const ComponentContextMenu = ({anchorPosition, onClose, onComponentDelete, contextMenuSelectedComponent, onComponentCreate, createOnly, mergeComponents, mergeable}: Props) => {
    const [importDocumentsOpen, setImportDocumentsOpen] = React.useState(false);
    const [showSnackbar] = useSnackbar();

    const handleCreateClick = () => {
        onClose()
        onComponentCreate()
    }

    const handleDeleteClick = () => {
        onClose()
        onComponentDelete()
    }

    const handleImportClick = () => {
        setImportDocumentsOpen(true)
    }

    const handleMergeClick = () => {
        mergeComponents()
    }

    const handleGoToSource = () => {
        if(contextMenuSelectedComponent.annotationSource === undefined){
            showSnackbar("No annotation source", SnackbarType.INFO)
        }else window.open(contextMenuSelectedComponent.annotationSource.iri,"_blank")
    }

    const closeDialogs = () => {
        setImportDocumentsOpen(false);
        onClose();
    }

    return (
        <Menu
            keepMounted
            open={anchorPosition.mouseY !== null}
            onClose={onClose}
            anchorReference="anchorPosition"
            anchorPosition={
                anchorPosition.mouseY !== null && anchorPosition.mouseX !== null ? {
                    top: anchorPosition.mouseY,
                    left: anchorPosition.mouseX
                } : undefined
            }
        >
            <MenuItem key="component-create" onClick={handleCreateClick}>Create</MenuItem>

            { createOnly && <MenuItem key="component-import" onClick={handleImportClick}>Import document</MenuItem>}
            {!createOnly && <MenuItem key="component-delete" onClick={handleDeleteClick}>Delete</MenuItem>}
            {!createOnly && <MenuItem key="component-source" onClick={handleGoToSource}> Go to source</MenuItem>}
            { mergeable  && <MenuItem key="component-merge"  onClick={handleMergeClick}> Merge into selection</MenuItem>}

            { importDocumentsOpen
                && <DocumentProvider>
                    <ImportDocumentDialog open={true} handleCloseDialog={closeDialogs}/>
                </DocumentProvider>
            }
        </Menu>
    );
}

export default ComponentContextMenu;