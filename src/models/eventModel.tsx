import VocabularyUtils from "@utils/VocabularyUtils";
import { AbstractModel, CONTEXT as ABSTRACT_CONTEXT } from "@models/abstractModel";
import { FailureMode, CONTEXT as FAILURE_MODE_CONTEXT } from "@models/failureModeModel";
import { Rectangle, CONTEXT as RECTANGLE_CONTEXT, PREFIX as DIAGRAM_PREFIX } from "@models/utils/Rectangle";

const XMLSchemaDateTime = "http://www.w3.org/2001/XMLSchema#dateTime";

const ctx = {
  name: VocabularyUtils.PREFIX + "name",
  description: VocabularyUtils.PREFIX + "description",
  gateType: VocabularyUtils.PREFIX + "gate-type",
  eventType: VocabularyUtils.PREFIX + "fault-event-type",
  rpn: VocabularyUtils.PREFIX + "has-rpn",
  probability: VocabularyUtils.PREFIX + "probability",
  children: VocabularyUtils.PREFIX + "has-child",
  failureMode: VocabularyUtils.PREFIX + "has-failure-mode",
  sequenceProbability: VocabularyUtils.PREFIX + "sequence-probability",
  childrenSequence: VocabularyUtils.PREFIX + "has-child-sequence",
  rectangle: DIAGRAM_PREFIX + "has-rectangle",
  supertypes: VocabularyUtils.PREFIX + "is-derived-from",
  hasFailureRate: VocabularyUtils.PREFIX + "has-failure-rate",
  requirement: VocabularyUtils.PREFIX + "has-requirement",
  upperBound: VocabularyUtils.PREFIX + "to",
  criticality: VocabularyUtils.PREFIX + "criticality",
  prediction: VocabularyUtils.PREFIX + "has-prediction",
  value: VocabularyUtils.PREFIX + "value",
  ataCode: VocabularyUtils.PREFIX + "ata-code",
  partNumber: VocabularyUtils.PREFIX + "part-number",
  stock: VocabularyUtils.PREFIX + "stock",
  behavior: VocabularyUtils.PREFIX + "is-manifestation-of",
  item: VocabularyUtils.PREFIX + "has-component",
  quantity: VocabularyUtils.PREFIX + "quantity",
  references: VocabularyUtils.PREFIX + "is-reference-to",
  isPartOf: VocabularyUtils.PREFIX + "is-part-of",
  isReference: VocabularyUtils.PREFIX + "is-reference",
  system: VocabularyUtils.PREFIX + "is-artifact-of",
  subSystem: VocabularyUtils.PREFIX + "is-performed-by",
  requiredFailureRate: VocabularyUtils.PREFIX + "required-failure-rate",
  calculatedFailureRate: VocabularyUtils.PREFIX + "calculated-failure-rate",
  components: VocabularyUtils.PREFIX + "components",
  creator: VocabularyUtils.DC_TERMS + "creator",
  created: {
    "@id": VocabularyUtils.DC_TERMS + "created",
    "@type": XMLSchemaDateTime,
  },
  modified: {
    "@id": VocabularyUtils.DC_TERMS + "modified",
    "@type": XMLSchemaDateTime,
  },
  fhaBasedFailureRate: VocabularyUtils.PREFIX + "fha-based-failure-rate",
  editor: VocabularyUtils.PREFIX + "editor",
  username: VocabularyUtils.PREFIX + "username",
  estimate: VocabularyUtils.PREFIX + "has-estimate",
};

export const CONTEXT = Object.assign({}, ctx, ABSTRACT_CONTEXT, FAILURE_MODE_CONTEXT, RECTANGLE_CONTEXT);

export enum EventType {
  BASIC = "BASIC",
  EXTERNAL = "EXTERNAL",
  UNDEVELOPED = "UNDEVELOPED",
  CONDITIONING = "CONDITIONING",
  INTERMEDIATE = "INTERMEDIATE",
}

export interface FaultEvent extends AbstractModel {
  eventType: EventType;
  name: string;
  description?: string;
  gateType?: GateType;
  probability?: number;
  children?: FaultEvent[];
  failureMode?: FailureMode;
  sequenceProbability?: number;
  childrenSequence?: any;
  rectangle?: Rectangle;
  probabilityRequirement?: number;
  iri?: string;
  isReference?: boolean;
  references?: {
    isPartOf?: string;
  };
  supertypes?: {
    criticality?: number;
    supertypes?: {
      hasFailureRate?: {
        estimate?: {
          value?: number;
        };
      };
    };
    behavior?: {
      item?: {
        quantity?: number;
        supertypes?: {
          ataCode?: string;
        };
      };
    };
    hasFailureRate?: {
      iri?: string;
      requirement?: {
        iri?: string;
        types?: string;
        upperBound?: number;
      };
    };
  };
}

export enum GateType {
  AND = "AND",
  OR = "OR",
  XOR = "XOR",
  PRIORITY_AND = "PRIORITY_AND",
  INHIBIT = "INHIBIT",
  UNUSED = "UNUSED",
}

// returns true as first argument of array if option should be enabled in select
export const gateTypeValues = (): [boolean, GateType][] =>
  Object.values(GateType).map((value) => {
    if (value === GateType.UNUSED) {
      return [false, GateType.UNUSED];
    } else {
      return [true, value];
    }
  });
