import {useEffect, useRef, useState} from "react";
import * as React from "react";
import useStyles from "../../EditorCanvas.styles";
import FaultEventShape from "../shapes/FaultEventShape";
import * as joint from 'jointjs';
import * as dagre from 'dagre';
import * as graphlib from 'graphlib';
import SidebarMenu from "../menu/SidebarMenu";
import {FaultEvent} from "@models/eventModel";
import FaultEventMenu from "@components/editor/faultTree/menu/faultEvent/FaultEventMenu";
import {CurrentFaultTreeTableProvider} from "@hooks/useCurrentFaultTreeTable";
import SidebarMenuHeader from "@components/editor/faultTree/menu/SidebarMenuHeader";
import * as svgPanZoom from "svg-pan-zoom";
import {SVG_PAN_ZOOM_OPTIONS} from "@utils/constants";
import {saveSvgAsPng} from "save-svg-as-png";
import usePrevious from "@hooks/usePrevious";

interface Props {
    treeName: string,
    rootEvent: FaultEvent,
    sidebarSelectedEvent: FaultEvent,
    onElementContextMenu: (element: any, evt: any) => void,
    onElementPointerClick: (element: any, evt: any) => void,
    onBlankPointerClick: () => void,
    onEventUpdated: (faultEvent: FaultEvent) => void,
    onConvertToTable: () => void,
    refreshTree: () => void,
    setHighlightedElement: (element: any) => void,
}

const EditorCanvas = ({
                          treeName,
                          rootEvent,
                          sidebarSelectedEvent,
                          onElementContextMenu,
                          onElementPointerClick,
                          onBlankPointerClick,
                          onEventUpdated,
                          onConvertToTable,
                          refreshTree,
                          setHighlightedElement
                      }: Props) => {
    const classes = useStyles()

    const containerRef = useRef(null)

    const [container, setContainer] = useState<joint.dia.Graph>()
    const [jointPaper, setJointPaper] = useState<joint.dia.Paper>()

    const [svgZoom, setSvgZoom] = useState(null)
    const [currentZoom, setCurrentZoom] = useState(1);
    const [isExportingImage, setIsExportingImage] = useState(false);
    const prevRootEventIri = usePrevious(rootEvent?.iri)

    useEffect(() => {
        const canvasWidth = containerRef.current.clientWidth;
        const canvasHeight = containerRef.current.clientHeight;

        const graph = new joint.dia.Graph;
        const divContainer = document.getElementById("jointjs-container");
        const paper = new joint.dia.Paper({
            // @ts-ignore
            el: divContainer,
            model: graph,
            width: canvasWidth,
            height: canvasHeight,
            gridSize: 10,
            drawGrid: true,
            restrictTranslate: true,
            defaultConnectionPoint: {name: 'boundary', args: {extrapolate: true}},
            defaultConnector: {name: 'rounded'},
            defaultRouter: {name: 'orthogonal'},
        })

        const diagramZoom = svgPanZoom('#jointjs-container > svg', {
            ...SVG_PAN_ZOOM_OPTIONS,
            onZoom: setCurrentZoom,
        });
        setSvgZoom(diagramZoom);

        // @ts-ignore
        paper.on({
            'element:contextmenu': (elementView, evt) => {
                onElementContextMenu(elementView, evt)
            },
            'element:pointerclick': (elementView, evt) => {
                onElementPointerClick(elementView, evt)
            },
            'blank:pointerclick': () => onBlankPointerClick(),
            'blank:pointerdown': () => diagramZoom.enablePan(),
            'blank:pointerup': () => diagramZoom.disablePan(),
        })

        setContainer(graph)
        setJointPaper(paper);
    }, []);

    useEffect(() => {
        if (isExportingImage) {
            const svgPaper = document.querySelector('#jointjs-container > svg');
            const padding = 20;
            const bbox = container.getBBox().inflate(padding);

            saveSvgAsPng(svgPaper, treeName + '.png', {
                width: (bbox.width * currentZoom) + padding,
                height: (bbox.height * currentZoom) + padding,
            });

            setIsExportingImage(false);
        }
    }, [isExportingImage])

    // let shapes = []
    //
    // const addSelf = (shape: any) => {
    //     shapes.push(shape)
    //     // shape.addTo(container)
    //     // layout(container)
    // }
    //
    // useEffect(() => {
    //     if(container && shapes){
    //         shapes.forEach(s => s.addTo(container))
    //         layout(container)
    //     }
    // })



    const layout = (graph) => {
        const autoLayoutElements = [];
        const manualLayoutElements = [];
        graph.getElements().forEach((el) => {
            const faultEventIri = el.get('custom/faultEventIri');
            if(faultEventIri && faultEventIri === sidebarSelectedEvent?.iri) {
                const elementView = el.findView(jointPaper);
                setHighlightedElement(elementView)
            }

            if (el.get('type') === 'fta.ConditioningEvent') {
                manualLayoutElements.push(el);
            } else {
                autoLayoutElements.push(el);
            }
        });
        // Automatic Layout
        joint.layout.DirectedGraph.layout(graph.getSubgraph(autoLayoutElements), {
            dagre: dagre,
            graphlib: graphlib,
            setVertices: true,
            marginX: 20,
            marginY: 20
        });
        // Manual Layout
        manualLayoutElements.forEach((el) => {
            const neighbor = graph.getNeighbors(el, {inbound: true})[0];
            if (!neighbor) return;
            const neighborPosition = neighbor.getBBox().bottomRight();
            el.position(neighborPosition.x + 20, neighborPosition.y - el.size().height / 2 - 20);
        });
    }

    const handleDiagramExport = () => {
        svgZoom.reset();
        setIsExportingImage(true);
    }


    // let _shapes
    // let _treeComponent
    // if(prevRootEventIri != rootEvent?.iri) {
    //
    // }
    // const renderTreeComponent = () => {
    //     if (rootEvent) {
    //         _shapes = []
    //         const addSelf = (shape: any) => {
    //             _shapes.push(shape)
    //         }
    //         _treeComponent = <FaultEventShape addSelf={addSelf} treeEvent={rootEvent}/>
    //
    //     }
    //     return _treeComponent;
    // }

    // let [shapes, setShapes] = useState(_shapes)
    // let [treeComponent, setTreeComponent] = useState(_treeComponent)
    let treeComponent = null
    useEffect(() => {
        if (container && rootEvent &&prevRootEventIri != rootEvent.iri){
            let _shapes = []
            const addSelf = (shape: any) => {
                _shapes.push(shape)
            }
            let _treeComponent = <FaultEventShape addSelf={addSelf} treeEvent={rootEvent}/>
            _shapes.forEach(s => s.addTo(container))
            layout(container)
        }
    }, [rootEvent, container])

    return (
        <div className={classes.root}>
            <div id="jointjs-container" className={classes.konvaContainer} ref={containerRef}>
                {treeComponent}
            </div>
            <SidebarMenu className={classes.sidebar}>
                <CurrentFaultTreeTableProvider>
                    <SidebarMenuHeader onExportDiagram={handleDiagramExport}
                                       onConvertToTable={onConvertToTable} onRestoreLayout={() => layout(container)}/>
                </CurrentFaultTreeTableProvider>
                <FaultEventMenu shapeToolData={sidebarSelectedEvent} onEventUpdated={onEventUpdated}
                                refreshTree={refreshTree}/>
            </SidebarMenu>
        </div>
    );
}

export default EditorCanvas;