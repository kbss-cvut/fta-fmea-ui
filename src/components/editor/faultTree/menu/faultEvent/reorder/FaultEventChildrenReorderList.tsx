import * as React from "react";
import {useEffect, useState} from "react";

import {SortableContainer, SortableElement, SortableHandle} from "react-sortable-hoc";
import {arrayMoveImmutable} from "array-move";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import DragHandleIcon from "@mui/icons-material/DragHandle";

import {FaultEvent} from "@models/eventModel";
import {flatten, sortBy, findIndex} from "lodash";
import {eventChildrenSorted} from "@services/faultEventService";

// https://codesandbox.io/s/l7v0qz869z

const DragHandle = SortableHandle(() => (
    <ListItemIcon>
        <DragHandleIcon/>
    </ListItemIcon>
));

const SortableItem = SortableElement<{ value: string }>(({value}) => (
    <ListItem ContainerComponent="div">
        <ListItemText primary={value}/>
        <ListItemSecondaryAction>
            <DragHandle/>
        </ListItemSecondaryAction>
    </ListItem>
));

const SortableListContainer = SortableContainer<{items: React.ReactNode[]}>(({items}) => (
    <List component="div">
        {items.map(({id, text}, index) => (
            <SortableItem key={id} index={index} value={text}/>
        ))}
    </List>
));


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

    const onSortEnd = ({oldIndex, newIndex}) => {
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
        <SortableListContainer
            items={items}
            onSortEnd={onSortEnd}
            useDragHandle={true}
            lockAxis="y"
        />
    );
};

export default FaultEventChildrenReorderList;