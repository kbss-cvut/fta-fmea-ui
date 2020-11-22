import * as React from "react";
import {useEffect} from "react";
import {JointProps} from "../../faultTree/shapes/EventShapeProps";
import {Component} from "@models/componentModel";
import {SystemComponent} from "@components/editor/system/shapes/shapesDefinitions";

export interface Props {
    component: Component,
    addSelf: (componentIri: string, any) => void,
    addLink: (componentIri: string, linkedComponentIri: string) => void,
    removeSelf: (componentIri: string, shape: any) => void,
}

const ComponentShape = ({addSelf, component, addLink, removeSelf}: Props) => {
    useEffect(() => {
        const componentShape = new SystemComponent();
        addSelf(component.iri, componentShape)

        componentShape.attr(['label', 'text'], component.name);

        // @ts-ignore
        componentShape.set('custom/componentIri', component.iri)

        if (component.linkedComponent) {
            addLink(component.iri, component.linkedComponent.iri)
        }

        return () => removeSelf(component.iri, componentShape);
    }, [component]);

    return <div/>
}

export default ComponentShape;