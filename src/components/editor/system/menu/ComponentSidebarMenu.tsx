import * as React from "react";
import {Divider, Typography} from "@material-ui/core";
import {Component} from "@models/componentModel";
import {FunctionsProvider} from "@hooks/useFunctions";
import ComponentFunctionsList from "@components/editor/system/menu/function/ComponentFunctionsList";

interface Props {
    component: Component,
}

const ComponentSidebarMenu = ({component}: Props) => {

    return (
        <React.Fragment>
            <Typography variant="h5" gutterBottom>Edit Component</Typography>
            {component ?
                <Typography variant="subtitle1" gutterBottom>{JSON.stringify(component)}</Typography>
                : <Typography variant="subtitle1" gutterBottom>No component selected</Typography>
            }
            {/*<ShapeToolPane data={shapeToolData} onEventUpdated={onEventUpdated}/>*/}
            <Divider/>

            {component && <React.Fragment>
                <Typography variant="h6" gutterBottom>Functions</Typography>
                <FunctionsProvider componentUri={component?.iri} >
                    <ComponentFunctionsList/>
                </FunctionsProvider>
                <Divider/>
            </React.Fragment>}
        </React.Fragment>
    );
}

export default ComponentSidebarMenu;