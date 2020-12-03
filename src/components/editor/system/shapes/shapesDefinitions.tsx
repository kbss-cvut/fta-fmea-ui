import * as joint from "jointjs";

const BaseComponent = joint.dia.Element.define('system.BaseComponent', {
    z: 3,
    attrs: {
        root: {
            pointerEvents: 'bounding-box'
        },
        body: {
            strokeWidth: 2,
            fillOpacity: 0.2
        },
        label: {
            textWrap: {
                height: -20,
                width: -20,
                ellipsis: true
            },
            refX: '50%',
            refY: '50%',
            fontSize: 16,
            fontFamily: 'sans-serif',
            fill: '#333333',
            textAnchor: 'middle',
            textVerticalAnchor: 'middle'
        },
    }
},);

export const SystemComponent = BaseComponent.define('system.Component', {
    size: {
        width: 100,
        height: 100
    },
    attrs: {
        root: {
            title: 'System Component'
        },
        body: {
            refWidth: '100%',
            refHeight: -40,
            stroke: '#3c4260',
            fill: '#3c4260'
        },
        label: {
            textWrap: {
                height: -40,
                width: -10,
            },
            refY2: -20
        }
    }
}, {
    markup: [{
        tagName: 'rect',
        selector: 'body'
    }, {
        tagName: 'text',
        selector: 'label'
    },],
});

export const SystemLink = joint.dia.Link.define('system.Link', {
    attrs: {
        line: {
            connection: true,
            stroke: '#333333',
            strokeWidth: 2,
            strokeLinejoin: 'round',
            targetMarker: {
                'type': 'path',
                'stroke': '#333333',
                'stroke-width': 2,
                fill: 'white',
                d: 'M 40 0 L 20 10 L 0 0 L 20 -10 z'
            }
        },
    }
}, {
    markup: [{
        tagName: 'path',
        selector: 'line',
        attributes: {
            'fill': 'none',
            'pointer-events': 'none'
        }
    },]
}, );