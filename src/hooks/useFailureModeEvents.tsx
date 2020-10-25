import {useFailureModes} from "./useFailureModes";
import {FaultEvent} from "@models/eventModel";

export const useFailureModeEvents = (): FaultEvent[] => {
    const [failureModes] = useFailureModes();
    return failureModes.map(value => value.manifestingNode.event) as FaultEvent[]
}