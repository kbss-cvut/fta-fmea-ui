import {CONTEXT as FAILURE_MODE_CONTEXT} from "@models/failureModeModel";
import {AbstractModel, CONTEXT as ABSTRACT_CONTEXT} from "@models/abstractModel";
import {Behavior, CONTEXT as BEHAVIOR_CONTEXT} from "@models/behaviorModel";

export const CONTEXT = Object.assign({}, ABSTRACT_CONTEXT, FAILURE_MODE_CONTEXT, BEHAVIOR_CONTEXT);

export interface CreateFunction extends AbstractModel {
    name: string,
}

export interface Function extends Behavior {
}
