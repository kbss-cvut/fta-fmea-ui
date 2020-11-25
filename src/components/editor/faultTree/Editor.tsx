import * as React from "react";
import {useEffect, useState} from "react";
import {cloneDeep, concat, flatten, assign, filter} from "lodash";
import EditorCanvas from "./canvas/EditorCanvas";
import {findEventByIri, findEventParentByIri} from "@utils/treeUtils";
import ElementContextMenu from "./menu/ElementContextMenu";
import {useLocalContext} from "@hooks/useLocalContext";
import * as faultEventService from "../../../services/faultEventService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {useCurrentFaultTree} from "@hooks/useCurrentFaultTree";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import FaultEventDialog from "../../dialog/faultEvent/FaultEventDialog";
import {FaultEvent} from "@models/eventModel";
import PngExporter, {PngExportData} from "@components/editor/export/PngExporter";

import {contextMenuDefaultAnchor, ElementContextMenuAnchor} from "@utils/contextMenu";
import {DashboardTitleProps} from "@components/dashboard/DashboardTitleProps";

const Editor = ({setAppBarName}: DashboardTitleProps) => {
    const [showSnackbar] = useSnackbar()
    const [requestConfirmation] = useConfirmDialog()

    const [faultTree, refreshTree] = useCurrentFaultTree()
    const [rootEvent, setRootEvent] = useState<FaultEvent>()
    const _localContext = useLocalContext({rootEvent})

    useEffect(() => {
        if (faultTree) {
            setAppBarName(faultTree.name)
            setRootEvent(faultTree.manifestingEvent)

            if (contextMenuSelectedEvent) {
                const sidebarEvent = findEventByIri(contextMenuSelectedEvent.iri, faultTree.manifestingEvent);
                setSidebarSelectedEvent(sidebarEvent)
            }
        }
    }, [faultTree])

    const [contextMenuSelectedEvent, setContextMenuSelectedEvent] = useState<FaultEvent>(null)
    const [sidebarSelectedEvent, setSidebarSelectedEvent] = useState<FaultEvent>(null)

    const [contextMenuAnchor, setContextMenuAnchor] = useState<ElementContextMenuAnchor>(contextMenuDefaultAnchor)
    const handleContextMenu = (elementView, evt) => {
        const elementIri = elementView.model.get('custom/faultEventIri');
        // @ts-ignore
        const foundEvent = findEventByIri(elementIri, _localContext.rootEvent);
        setContextMenuSelectedEvent(foundEvent);
        setContextMenuAnchor({mouseX: evt.pageX, mouseY: evt.pageY,})
    }

    const [eventDialogOpen, setEventDialogOpen] = useState(false);

    const handleEventUpdate = (eventToUpdate: FaultEvent) => {
        faultEventService.update(eventToUpdate)
            .then(value => refreshTree())
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const handleEventDelete = (eventToDelete: FaultEvent) => {
        const deleteEvent = () => {
            setSidebarSelectedEvent(null);
            faultEventService.remove(eventToDelete.iri)
                .then(value => refreshTree())
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
        }

        requestConfirmation({
            title: 'Delete Event',
            explanation: 'Deleting the event will delete all events in its subtree. Are you sure?',
            onConfirm: deleteEvent,
        })
    }

    const [exportData, setExportData] = useState<PngExportData>();

    return (
        <React.Fragment>
            <EditorCanvas
                rootEvent={rootEvent}
                exportImage={(encodedData) => setExportData(encodedData)}
                onEventUpdated={handleEventUpdate}
                sidebarSelectedEvent={sidebarSelectedEvent}
                onElementContextMenu={handleContextMenu}
            />

            <ElementContextMenu
                eventType={contextMenuSelectedEvent?.eventType}
                anchorPosition={contextMenuAnchor}
                onEditClick={() => setSidebarSelectedEvent(contextMenuSelectedEvent)}
                onNewEventClick={() => setEventDialogOpen(true)}
                onEventDelete={() => handleEventDelete(contextMenuSelectedEvent)}
                onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}/>


            <FaultEventDialog open={eventDialogOpen} eventIri={contextMenuSelectedEvent?.iri}
                              onCreated={refreshTree}
                              onClose={() => setEventDialogOpen(false)}/>

            {exportData && <PngExporter open={Boolean(exportData)} exportData={exportData}
                                        onClose={() => setExportData(null)}/>}
        </React.Fragment>
    );
}

export default Editor;