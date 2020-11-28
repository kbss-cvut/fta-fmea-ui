import * as React from "react";
import {useEffect, useState} from "react";

import {SortableContainer, SortableElement, SortableHandle} from "react-sortable-hoc";
import * as arrayMove from "array-move";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DragHandleIcon from "@material-ui/icons/DragHandle";

import {FaultEvent} from "@models/eventModel";
import {flatten, sortBy, findIndex} from "lodash";
import {eventChildrenSorted} from "@services/faultEventService";

// https://codesandbox.io/s/l7v0qz869z

const DragHandle = SortableHandle(() => (
    <ListItemIcon>
        <DragHandleIcon/>
    </ListItemIcon>
));

const SortableItem = SortableElement(({text}) => (
    <ListItem ContainerComponent="div">
        <ListItemText primary={text}/>
        <ListItemSecondaryAction>
            <DragHandle/>
        </ListItemSecondaryAction>
    </ListItem>
));

const SortableListContainer = SortableContainer(({items}) => (
    <List component="div">
        {items.map(({id, text}, index) => (
            <SortableItem key={id} index={index} text={text}/>
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
            const newItems = arrayMove(items, oldIndex, newIndex)
            handleChildrenReordered(newItems);
            return newItems;
        });
    };

    const handleChildrenReordered = (values: any[]) => {
        console.log('handleChildrenReordered')
        const reorderedValues = values.map(child => child.value);
        console.log(reorderedValues)
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