import * as joint from "jointjs";
import { LABEL_FONT_SIZE } from "./constants";

const MAIN_EVENT_BODY_COLOR = "#000000";
const MAIN_GATE_COLOR = "#057dcd";
const BASIC_GATE_COLOR = "#4c956c";
const EXTERNAL_GATE_COLOR = "#ffa600";
const FILL_OPACITY = 0.4;
const STROKE_COLOR = "#000000";
const DEFAULT_EVENT_HEIGHT = 110;

const Event = joint.dia.Element.define(
  "fta.Event",
  {
    z: 3,
    attrs: {
      root: {
        pointerEvents: "bounding-box",
      },
      body: {
        strokeWidth: 2,
        fillOpacity: 0.2,
      },
      label: {
        fontSize: LABEL_FONT_SIZE,
        textWrap: {
          height: -20,
          width: -20,
        },
        refX: "50%",
        refY: "50%",
        fontFamily: "sans-serif",
        fill: "#333333",
        textAnchor: "middle",
        textVerticalAnchor: "middle",
        cursor: "pointer",
      },
      probabilityLabel: {
        fontSize: 16,
        fontFamily: "sans-serif",
        fill: "#333333",
        textAnchor: "start",
        textVerticalAnchor: "middle",
        refX: "60%",
        refY: "73%",
      },
      probabilityRequirementLabel: {
        fontSize: 16,
        fontFamily: "sans-serif",
        fill: "#333333",
        textAnchor: "end",
        textVerticalAnchor: "middle",
        refX: "100%",
        refY: "-10%",
      },
    },
  },
  {
    markup: [
      {
        tagName: "text",
        selector: "probabilityLabel",
      },
      {
        tagName: "text",
        selector: "probabilityRequirementLabel",
      },
    ],
  },
);

export const IntermediateEvent = Event.define(
  "fta.IntermediateEvent",
  {
    size: {
      width: 100,
      height: DEFAULT_EVENT_HEIGHT,
    },
    attrs: {
      root: {
        title: "Intermediate Event",
      },
      body: {
        refWidth: "100%",
        refHeight: -40,
        stroke: MAIN_EVENT_BODY_COLOR,
        fill: MAIN_EVENT_BODY_COLOR,
      },
      gate: {
        stroke: STROKE_COLOR,
        fill: MAIN_GATE_COLOR,
        fillOpacity: FILL_OPACITY,
        strokeWidth: 2,
        refX: "50%",
        refY: "117%",
        fillRule: "nonzero",
        cursor: "pointer",
      },
      label: {
        fontSize: LABEL_FONT_SIZE,
        textWrap: {
          height: -40,
          width: -10,
        },
        refY2: -20,
      },
    },
  },
  {
    markup: [
      {
        tagName: "path",
        selector: "gate",
      },
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "text",
        selector: "label",
      },
      {
        tagName: "text",
        selector: "probabilityLabel",
      },
      {
        tagName: "text",
        selector: "probabilityRequirementLabel",
      },
    ],
    gateTypes: {
      or: "M -20 0 C -20 -15 -10 -30 0 -30 C 10 -30 20 -15 20 0 C 10 -6 -10 -6 -20 0 M 0 -30",
      xor: "M -20 0 C -20 -15 -10 -30 0 -30 C 10 -30 20 -15 20 0 C 10 -6 -10 -6 -20 0 M -20 0 0 -30 M 0 -30 20 0",
      and: "M -20 0 C -20 -25 -10 -30 0 -30 C 10 -30 20 -25 20 0 Z",
      priority_and: "M -20 0 C -20 -25 -10 -30 0 -30 C 10 -30 20 -25 20 0 Z M -20 0 0 -30 20 0",
      inhibit: "M -10 0 -20 -15 -10 -30 10 -30 20 -15 10 0 Z",
      transfer: "M -20 0 20 0 0 -30 z",
    },
    gate: function (type) {
      if (type === undefined) return this.attr(["gate", "gateType"]);
      return this.attr(["gate"], {
        gateType: type,
        title: type.toUpperCase() + " Gate",
      });
    },
  },
  {
    attributes: {
      gateType: {
        set: function (type) {
          const data = this.model.gateTypes[type];
          const verticalLine = type === "or" || type === "xor" ? " M 0 -4 V 15" : " M 0 1 V 15";
          return { d: data ? data + " M 0 -30 0 -60" + verticalLine : "M 0 0 0 0" };
        },
      },
    },
  },
);

export const ExternalEvent = Event.define(
  "fta.ExternalEvent",
  {
    size: {
      width: 100,
      height: DEFAULT_EVENT_HEIGHT,
    },
    attrs: {
      root: {
        title: "External Event",
      },
      body: {
        refWidth: "100%",
        refHeight: -40,
        stroke: MAIN_EVENT_BODY_COLOR,
        fill: MAIN_EVENT_BODY_COLOR,
      },
      label: {
        fontSize: LABEL_FONT_SIZE,
        textWrap: {
          height: -40,
          width: -10,
        },
        refY2: -20,
      },
      gate: {
        d: "M -15 -16 L 0 -30 L 15 -16 L 15 0 L -15 0 Z M 0 -30 L 0 -59",
        stroke: STROKE_COLOR,
        fill: EXTERNAL_GATE_COLOR,
        fillOpacity: FILL_OPACITY,
        strokeWidth: 2,
        refX: "50%",
        refY: "117%",
        fillRule: "nonzero",
        cursor: "pointer",
      },
      icon: {
        d: "M3.9 7c0-1.71 1.39-3.1 3.1-3.1h4V2H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 8h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V12h4c2.76 0 5-2.24 5-5s-2.24-5-5-5",
        stroke: "none",
        fill: MAIN_EVENT_BODY_COLOR,
      },
    },
  },
  {
    markup: [
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "text",
        selector: "label",
      },
      {
        tagName: "text",
        selector: "probabilityLabel",
      },
      {
        tagName: "text",
        selector: "probabilityRequirementLabel",
      },
      {
        tagName: "path",
        selector: "gate",
      },
      {
        tagName: "path",
        selector: "icon",
      },
    ],
  },
);

export const UndevelopedEvent = Event.define(
  "fta.UndevelopedEvent",
  {
    size: {
      width: 100,
      height: DEFAULT_EVENT_HEIGHT,
    },
    attrs: {
      root: {
        title: "Undeveloped Event",
      },
      body: {
        refWidth: "100%",
        refHeight: -40,
        stroke: "#fe854f",
        fill: "#fe854f",
      },
      label: {
        fontSize: LABEL_FONT_SIZE,
        textWrap: {
          height: -40,
          width: -10,
        },
        refY2: -20,
      },
    },
  },
  {
    markup: [
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "text",
        selector: "label",
      },
      {
        tagName: "text",
        selector: "probabilityLabel",
      },
      {
        tagName: "text",
        selector: "probabilityRequirementLabel",
      },
    ],
  },
);

export const BasicEvent = Event.define(
  "fta.BasicEvent",
  {
    size: {
      width: 100,
      height: DEFAULT_EVENT_HEIGHT,
    },
    z: 3,
    attrs: {
      root: {
        title: "Basic Event",
      },
      body: {
        refWidth: "100%",
        refHeight: -40,
        stroke: MAIN_EVENT_BODY_COLOR,
        fill: MAIN_EVENT_BODY_COLOR,
      },
      label: {
        fontSize: LABEL_FONT_SIZE,
        textWrap: {
          height: -40,
          width: -10,
        },
        refY2: -20,
      },
      gate: {
        d: "M 0.0001 0 A 15 15 0 1 0 0 0 M 0 -30 L 0 -59",
        stroke: "black",
        fill: BASIC_GATE_COLOR,
        fillOpacity: FILL_OPACITY,
        strokeWidth: 2,
        refX: "50%",
        refY: "117%",
        fillRule: "nonzero",
        cursor: "pointer",
      },
    },
  },
  {
    markup: [
      {
        tagName: "rect",
        selector: "body",
      },
      {
        tagName: "text",
        selector: "label",
      },
      {
        tagName: "text",
        selector: "probabilityLabel",
      },
      {
        tagName: "text",
        selector: "probabilityRequirementLabel",
      },
      {
        tagName: "path",
        selector: "gate",
      },
    ],
  },
);

export const ConditioningEvent = Event.define(
  "fta.ConditioningEvent",
  {
    size: {
      width: 140,
      height: 80,
    },
    z: 2,
    attrs: {
      root: {
        title: "Conditioning Event",
      },
      body: {
        refCx: "50%",
        refCy: "50%",
        refRx: "50%",
        refRy: "50%",
        stroke: "#7c68fc",
        fill: "#7c68fc",
        fillOpacity: 0.2,
      },
    },
  },
  {
    markup: [
      {
        tagName: "ellipse",
        selector: "body",
      },
      {
        tagName: "text",
        selector: "label",
      },
      {
        tagName: "text",
        selector: "probabilityLabel",
      },
      {
        tagName: "text",
        selector: "probabilityRequirementLabel",
      },
    ],
  },
);

export const Link = joint.dia.Link.define(
  "fta.Link",
  {
    attrs: {
      line: {
        connection: true,
        stroke: "#333333",
        strokeWidth: 2,
        strokeLinejoin: "round",
      },
    },
  },
  {
    markup: [
      {
        tagName: "path",
        selector: "line",
        attributes: {
          fill: "none",
          "pointer-events": "none",
        },
      },
    ],
  },
  {
    create: function (event1, event2) {
      const link = new this({
        z: 1,
        source: {
          id: event1.id,
          selector: event1.get("type") === "fta.IntermediateEvent" ? "gate" : "body",
          anchor: {
            name: "bottom",
            args: {
              dy: 1,
            },
          },
        },
        target: {
          id: event2.id,
          selector: "body",
        },
      });

      return link;
    },
  },
);

let boundary = null;
// @ts-ignore
export const FTABoundary = joint.elementTools.Boundary.extend(
  {
    attributes: {
      fill: "none",
      "pointer-events": "none",
      "stroke-width": 2,
      stroke: " #31d0c6",
      rx: 5,
      ry: 5,
    },
  },
  {
    factory: function () {
      if (!boundary) boundary = new FTABoundary();
      return boundary;
    },
  },
);
