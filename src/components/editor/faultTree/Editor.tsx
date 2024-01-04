import * as React from "react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import EditorCanvas from "./canvas/EditorCanvas";
import {findEventByIri} from "@utils/treeUtils";
import FaultEventContextMenu from "./menu/faultEvent/FaultEventContextMenu";
import {useLocalContext} from "@hooks/useLocalContext";
import * as faultEventService from "@services/faultEventService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {useCurrentFaultTree} from "@hooks/useCurrentFaultTree";
import {useConfirmDialog} from "@hooks/useConfirmDialog";
import FaultEventDialog from "../../dialog/faultEvent/FaultEventDialog";
import {FaultEvent} from "@models/eventModel";
import {contextMenuDefaultAnchor, ElementContextMenuAnchor} from "@utils/contextMenu";
import {DashboardTitleProps} from "@components/dashboard/DashboardTitleProps";
import FailureModesTableDialog from "@components/dialog/failureModesTable/FailureModesTableDialog";
import {ROUTES} from "@utils/constants";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import {FTABoundary} from "@components/editor/faultTree/shapes/shapesDefinitions";
import * as joint from "jointjs";
import {Rectangle} from "@models/utils/Rectangle";

const Editor = ({setAppBarName}: DashboardTitleProps) => {
    const history = useNavigate();
    const [showSnackbar] = useSnackbar()
    const [requestConfirmation] = useConfirmDialog()

    const [faultTree, refreshTree] = useCurrentFaultTree()
    const [rootEvent, setRootEvent] = useState<FaultEvent>()

    const [highlightedElementView, setHighlightedElementView] = useState(null)
    const _localContext = useLocalContext({rootEvent: rootEvent, highlightedElementView: highlightedElementView})

    useEffect(() => {
        if (faultTree) {
            setAppBarName(faultTree.name)
            setRootEvent(faultTree.manifestingEvent)

            if (contextMenuSelectedEvent) {
                const sidebarEvent = findEventByIri(contextMenuSelectedEvent.iri, faultTree.manifestingEvent);
                setSidebarSelectedEvent(sidebarEvent)
            }

            if (sidebarSelectedEvent) {
                const sidebarEvent = findEventByIri(sidebarSelectedEvent.iri, faultTree.manifestingEvent);
                setSidebarSelectedEvent(sidebarEvent)
            }
        }
    }, [faultTree])

    useEffect(() => {
        if (highlightedElementView) {
            highlightBorders(highlightedElementView);
        }
    }, [highlightedElementView])

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

    const handleElementPointerClick = (elementView) => {
        const elementIri = elementView.model.get('custom/faultEventIri');
        // @ts-ignore
        const foundEvent = findEventByIri(elementIri, _localContext.rootEvent);

        setSidebarSelectedEvent(foundEvent);
        setHighlightedElementView(elementView);
    }

    const handleBlankPointerClick = () => {
        setSidebarSelectedEvent(null);
        hideHighlightedBorders();
    }

    const handleMoveEvent = (elementView, evt) => {
        const faultEventIri = elementView.model.get('custom/faultEventIri');
        // @ts-ignore
        const movedEvent = findEventByIri(faultEventIri, _localContext.rootEvent);
        const rect :Rectangle = movedEvent.rectangle;
        const size = elementView.model.attributes.size;
        const position = elementView.model.attributes.position;
        if(rect.x != position.x || rect.y != position.y || rect.width != size.width || rect.height != size.height) {
            rect.x = position.x;
            rect.y = position.x;
            rect.width = size.width;
            rect.height = size.height;
            faultEventService.updateEventRectangle(faultEventIri, rect.iri, rect);
        }
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

    const [eventDialogOpen, setEventDialogOpen] = useState(false);

    const handleEventUpdate = (eventToUpdate: FaultEvent) => {
        faultEventService.update(eventToUpdate)
            .then(value => refreshTree())
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
    }

    const handleEventDelete = (eventToDelete: FaultEvent) => {
        const deleteEvent = () => {
            setSidebarSelectedEvent(null);
            hideHighlightedBorders();
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

    const [failureModesTableOpen, setFailureModesTableOpen] = useState(false);
    const handleFailureModesTableCreated = (tableIri: string) => {
        console.log(`handleFailureModesTableCreated - ${tableIri}`)

        const tableFragment = extractFragment(tableIri);
        history(ROUTES.FMEA + tableFragment);
    }

    return (
        <React.Fragment>
            <EditorCanvas
                treeName={faultTree?.name}
                rootEvent={rootEvent}
                onEventUpdated={handleEventUpdate}
                sidebarSelectedEvent={sidebarSelectedEvent}
                onElementContextMenu={handleContextMenu}
                onElementPointerClick={handleElementPointerClick}
                onBlankPointerClick={handleBlankPointerClick}
                onConvertToTable={() => setFailureModesTableOpen(true)}
                onNodeMove={handleMoveEvent}
                setHighlightedElement={setHighlightedElementView}
                refreshTree={refreshTree}
            />

            <FaultEventContextMenu
                eventType={contextMenuSelectedEvent?.eventType}
                isRootEvent={contextMenuSelectedEvent?.iri === faultTree?.manifestingEvent?.iri}
                anchorPosition={contextMenuAnchor}
                onNewEventClick={() => setEventDialogOpen(true)}
                onEventDelete={() => handleEventDelete(contextMenuSelectedEvent)}
                onClose={() => setContextMenuAnchor(contextMenuDefaultAnchor)}/>


            <FaultEventDialog open={eventDialogOpen}
                              eventIri={contextMenuSelectedEvent?.iri} treeUri={faultTree?.iri}
                              onCreated={refreshTree}
                              onClose={() => setEventDialogOpen(false)}/>

            <FailureModesTableDialog
                open={failureModesTableOpen}
                faultTreeIri={faultTree?.iri}
                onCreated={handleFailureModesTableCreated}
                onClose={() => setFailureModesTableOpen(false)}/>
        </React.Fragment>
    );
}

export default Editor;