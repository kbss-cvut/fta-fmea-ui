import {EventType, FaultEvent} from "@models/eventModel";
import {
    BasicEvent,
    ConditioningEvent,
    ExternalEvent,
    IntermediateEvent,
    UndevelopedEvent
} from "@components/editor/faultTree/shapes/shapesDefinitions";

export const createShape = (faultEvent: FaultEvent) => {
    switch (faultEvent.eventType) {
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