import * as React from "react";
import {useEffect, useState} from "react";

import {arrayMoveImmutable} from "array-move";
import DragHandleIcon from "@mui/icons-material/DragHandle";

import {FaultEvent} from "@models/eventModel";
import {flatten} from "lodash";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


interface Props {
    eventChildren: FaultEvent[],
    handleReorder: (childrenSequence: FaultEvent[]) => void,
}

const FaultEventChildrenReorderList = ({eventChildren, handleReorder}: Props) => {
    const mapChildEvents = (events) => {
        return flatten([events]).map((child, index) => {
            return {
                id: index,
                text: child.name,
                value: child,
            }
        });
    };

    const [items, setItems] = useState([]);

    useEffect(() => {
        setItems(mapChildEvents(eventChildren));
    }, [eventChildren])

    const onSortEnd = (result) => {
        if(!result.destination) return;

        const oldIndex = result.source.index;
        const newIndex = result.destination.index;

        setItems(items => {
            const newItems = arrayMoveImmutable(items, oldIndex, newIndex)
            handleChildrenReordered(newItems);
            return newItems;
        });
    };

    const handleChildrenReordered = (values: any[]) => {
        const reorderedValues = values.map(child => child.value);
        handleReorder(reorderedValues);
    }

    return (
        <DragDropContext onDragEnd={onSortEnd}>
            <Droppable droppableId={"faultEventList"}>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {
                            items.map((item, idx) => (
                                <Draggable key={item.id} draggableId={`fault-event-${item.id}`} index={idx}>
                                    {(provided) => (
                                        <div ref={provided.innerRef}
                                            {...provided.draggableProps}
                                             {...provided.dragHandleProps}>
                                            <div style={{ border: "solid 1px rgba(0, 0, 0, 0.23)", padding: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                { item.text }
                                                <DragHandleIcon/>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        }
                        { provided.placeholder }
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default FaultEventChildrenReorderList;