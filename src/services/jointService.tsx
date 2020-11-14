import {TreeNode} from "@models/treeNodeModel";
import {EventType} from "@models/eventModel";
import {
    BasicEvent,
    ConditioningEvent,
    ExternalEvent,
    IntermediateEvent,
    UndevelopedEvent
} from "@components/editor/shapes/joint/shapesDefinitions";

export const createShape = (node: TreeNode) => {
    switch (node.event.eventType) {
        case EventType.BASIC:
            return new BasicEvent();
        case EventType.CONDITIONING:
            return new ConditioningEvent();
        case EventType.EXTERNAL:
            return new ExternalEvent();
        case EventType.INTERMEDIATE:
            return new IntermediateEvent();
        case EventType.UNDEVELOPED:
            return new UndevelopedEvent();
    }
}