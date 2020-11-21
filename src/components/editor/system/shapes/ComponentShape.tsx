import * as React from "react";
import {useEffect} from "react";
import {JointProps} from "../../faultTree/shapes/EventShapeProps";
import {Component} from "@models/componentModel";
import {SystemComponent} from "@components/editor/system/shapes/shapesDefinitions";

export interface Props extends JointProps {
    component: Component,
}

const ComponentShape = ({addSelf, component}: Props) => {
    useEffect(() => {
        const componentShape = new SystemComponent();
        addSelf(componentShape)

        componentShape.attr(['label', 'text'], component.name);

        // @ts-ignore
        componentShape.set('custom/componentIri', component.iri)

        return () => componentShape.remove();
    }, [component]);

    return <div/>
}

export default ComponentShape;