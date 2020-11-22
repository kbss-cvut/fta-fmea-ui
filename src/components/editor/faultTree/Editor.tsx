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
import PngExporter, {PngExportData} from "@components/editor/faultTree/tools/PngExporter";

import {contextMenuDefaultAnchor, ElementContextMenuAnchor} from "@utils/contextMenu";

const Editor = () => {
    const [showSnackbar] = useSnackbar()
    const [requestConfirmation] = useConfirmDialog()

    const [faultTree, updateFaultTree] = useCurrentFaultTree()
    const [rootEvent, setRootEvent] = useState<FaultEvent>()
    const _localContext = useLocalContext({rootEvent})

    useEffect(() => {
        if (faultTree) {
            setRootEvent(faultTree.manifestingEvent)
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
    const handleEventCreated = (newEvent: FaultEvent) => {
        // @ts-ignore
        const rootEventClone = cloneDeep(_localContext.rootEvent);

        const foundEvent = findEventByIri(contextMenuSelectedEvent.iri, rootEventClone);
        foundEvent.children = concat(flatten([foundEvent.children]), newEvent)

        // propagate changes locally in the app
        faultTree.manifestingEvent = rootEventClone
        updateFaultTree(faultTree)
        setRootEvent(rootEventClone)
    }

    const handleEventUpdate = (eventToUpdate: FaultEvent) => {
        console.log(`handleEventUpdate - ${eventToUpdate.iri}`)
        faultEventService.update(eventToUpdate)
            .then(value => {
                // @ts-ignore
                const rootEventClone = cloneDeep(_localContext.rootEvent);

                const foundEvent = findEventByIri(eventToUpdate.iri, rootEventClone);
                assign(foundEvent, eventToUpdate)

                // propagate changes locally in the app
                faultTree.manifestingEvent = rootEventClone
                updateFaultTree(faultTree)
            })
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const handleEventDelete = (eventToDelete: FaultEvent) => {
        const deleteEvent = () => {
            faultEventService.remove(eventToDelete.iri)
                .then(value => {
                    // @ts-ignore
                    const rootEventClone = cloneDeep(_localContext.rootEvent);

                    if (rootEventClone.iri === eventToDelete.iri) {
                        // TODO how delete root event? Is it allowed?
                        console.log('Removing top event')
                    } else {
                        const parent = findEventParentByIri(eventToDelete.iri, rootEventClone);
                        parent.children = filter(flatten([parent.children]), (o) => o.iri !== eventToDelete.iri)
                    }

                    // propagate changes locally in the app
                    faultTree.manifestingEvent = rootEventClone
                    updateFaultTree(faultTree)
                })
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
                              onCreated={handleEventCreated}
                              onClose={() => setEventDialogOpen(false)}/>

            {exportData && <PngExporter open={Boolean(exportData)} exportData={exportData}
                                        onClose={() => setExportData(null)}/>}
        </React.Fragment>
    );
}

export default Editor;