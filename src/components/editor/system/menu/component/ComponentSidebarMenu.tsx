import * as React from "react";
import {Divider, Typography} from "@material-ui/core";
import {Component} from "@models/componentModel";
import {FunctionsProvider} from "@hooks/useFunctions";
import ComponentFunctionsList from "../function/ComponentFunctionsList";
import ComponentEditMenu from "@components/editor/system/menu/component/ComponentEditMenu";

interface Props {
    component: Component,
    onComponentUpdated: (component: Component) => void,
}

const ComponentSidebarMenu = ({component, onComponentUpdated}: Props) => {

    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom>Edit Component</Typography>
            {component ? <ComponentEditMenu component={component} onComponentUpdated={onComponentUpdated}/> :
                <Typography variant="subtitle1" gutterBottom>No component selected</Typography>
            }
            <Divider/>

            {component && <React.Fragment>
                <Typography variant="h6" gutterBottom>Functions</Typography>
                <FunctionsProvider componentUri={component?.iri}>
                    <ComponentFunctionsList/>
                </FunctionsProvider>
                <Divider/>
            </React.Fragment>}
        </React.Fragment>
    );
}

export default ComponentSidebarMenu;