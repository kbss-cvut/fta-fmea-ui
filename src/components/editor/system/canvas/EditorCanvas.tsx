import {useEffect, useRef, useState} from "react";
import * as React from "react";
import useStyles from "../../EditorCanvas.styles";
import * as joint from 'jointjs';
import * as dagre from 'dagre';
import * as graphlib from 'graphlib';
import {System} from "@models/systemModel";
import {Component} from "@models/componentModel";
import {flatten, cloneDeep} from "lodash";
import ComponentShape from "@components/editor/system/shapes/ComponentShape";
import DiagramOptions from "@components/editor/menu/DiagramOptions";
import SidebarMenu from "@components/editor/faultTree/menu/SidebarMenu";
import ComponentSidebarMenu from "@components/editor/system/menu/component/ComponentSidebarMenu";
import {SystemLink} from "@components/editor/system/shapes/shapesDefinitions";
import * as svgPanZoom from "svg-pan-zoom";
import {SVG_PAN_ZOOM_OPTIONS} from "@utils/constants";
import {saveSvgAsPng} from "save-svg-as-png";

interface Props {
    system: System,
    sidebarSelectedComponent: Component,
    onBlankContextMenu: (evt: any) => void,
    onElementContextMenu: (element: any, evt: any) => void,
    onElementPointerClick: (element: any, evt: any) => void,
    onBlankPointerClick: () => void,
    onComponentUpdated: (component: Component) => void,
    setHighlightedElement: (element: any) => void,
}

const EditorCanvas = ({
                          system,
                          sidebarSelectedComponent,
                          onBlankContextMenu,
                          onElementContextMenu,
                          onElementPointerClick,
                          onBlankPointerClick,
                          onComponentUpdated,
                          setHighlightedElement
                      }: Props) => {
    const { classes } = useStyles()

    const containerRef = useRef(null)

    const [container, setContainer] = useState<joint.dia.Graph>()
    const [jointPaper, setJointPaper] = useState<joint.dia.Paper>()

    const [svgZoom, setSvgZoom] = useState(null)
    const [currentZoom, setCurrentZoom] = useState(1);
    const [isExportingImage, setIsExportingImage] = useState(false);

    useEffect(() => {
        const canvasWidth = containerRef.current.clientWidth;
        const canvasHeight = containerRef.current.clientHeight;

        const graph = new joint.dia.Graph;
        const divContainer = document.getElementById("jointjs-system-container");
        const paper = new joint.dia.Paper({
            el: divContainer,
            model: graph,
            width: canvasWidth,
            height: canvasHeight,
            gridSize: 10,
            drawGrid: true,
            restrictTranslate: true,
            defaultConnector: {name: 'normal'},
            defaultRouter: {name: 'normal'},
        })

        const diagramZoom = svgPanZoom('#jointjs-system-container > svg', {
            ...SVG_PAN_ZOOM_OPTIONS,
            onZoom: setCurrentZoom,
        });
        setSvgZoom(diagramZoom);

        paper.on({
            'blank:contextmenu': (evt) => {
                onBlankContextMenu(evt);
            },
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
        setJointPaper(paper)
    }, []);

    useEffect(() => {
        if(isExportingImage) {
            const svgPaper = document.querySelector('#jointjs-system-container > svg');
            const padding = 20;
            const bbox = container.getBBox().inflate(padding);

            saveSvgAsPng(svgPaper, system?.name + '.png', {
                width: (bbox.width * currentZoom) + padding,
                height: (bbox.height * currentZoom) + padding,
            });

            setIsExportingImage(false);
        }
    }, [isExportingImage])

    const [componentShapesMap, setComponentShapesMap] = useState<Map<string, any>>(new Map());
    const [componentLinksMap, setComponentLinksMap] = useState<Map<string, string>>(new Map());

    const addSelf = (componentIri: string, shape: any) => {
        shape.addTo(container)
        layout(container)

        setComponentShapesMap(prevMap => {
            const mapClone = cloneDeep(prevMap);
            mapClone.set(componentIri, shape);
            return mapClone;
        })
    }

    const layout = (graph) => {
        graph.getElements().forEach((el) => {
            const componentIri = el.get('custom/componentIri');
            if(componentIri && componentIri === sidebarSelectedComponent?.iri) {
                const elementView = el.findView(jointPaper);
                setHighlightedElement(elementView)
            }
        })

        joint.layout.DirectedGraph.layout(graph, {
            rankDir: "BT",
            dagre: dagre,
            graphlib: graphlib,
            setVertices: true,
            marginX: 20,
            marginY: 20
        });
    }

    const handleDiagramExport = () => {
        svgZoom.reset();
        setIsExportingImage(true);
    }

    const addLink = (componentIri: string, linkedComponentIri: string) => {
        setComponentLinksMap(prevMap => {
            const mapClone = cloneDeep(prevMap);
            mapClone.set(componentIri, linkedComponentIri);
            return mapClone;
        })
    }

    const removeSelf = (componentIri: string, shape: any) => {
        setComponentLinksMap(prevMap => {
            const mapClone = cloneDeep(prevMap);
            mapClone.delete(componentIri);
            return mapClone;
        })
        shape.remove();
    }

    useEffect(() => {
        drawLinks(componentShapesMap, componentLinksMap)
    }, [componentShapesMap, componentLinksMap])

    const drawLinks = (componentShapesMap, componentLinksMap) => {
        componentLinksMap.forEach((sourceIri, targetIri) => {
            const sourceShape = componentShapesMap.get(sourceIri)
            const targetShape = componentShapesMap.get(targetIri)
            if (sourceShape && targetShape) {
                const link = new SystemLink();

                link.source(targetShape);
                link.target(sourceShape, {
                    connectionPoint: {
                        name: 'anchor',
                    },
                    anchor: {name: 'bottom'}
                });
                link.addTo(container);
            }
        })
        if (container) {
            layout(container)
        }
    }

    return (
        <div className={classes.root}>
            <div id="jointjs-system-container" className={classes.konvaContainer} ref={containerRef}>
                {container && system &&
                flatten([system.components])
                    .map(value => <ComponentShape key={value.iri} component={value}
                                                  addSelf={addSelf} addLink={addLink} removeSelf={removeSelf}/>)
                }
            </div>
            <SidebarMenu className={classes.sidebar}>
                <DiagramOptions onRestoreLayout={() => layout(container)} onExportDiagram={handleDiagramExport}/>
                {system && <ComponentSidebarMenu
                    component={sidebarSelectedComponent}
                    onComponentUpdated={onComponentUpdated}
                    systemComponents={system?.components}
                />}
            </SidebarMenu>
        </div>
    );
}

export default EditorCanvas;