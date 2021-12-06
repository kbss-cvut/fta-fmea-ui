import * as React from "react";
import {Divider, TextField, Typography} from "@material-ui/core";
import {Component} from "@models/componentModel";
import {FunctionsProvider} from "@hooks/useFunctions";
import ComponentFunctionsList from "../function/ComponentFunctionsList";
import ComponentFailureModesList from "../failureMode/ComponentFailureModesList";
import ComponentEditMenu from "@components/editor/system/menu/component/ComponentEditMenu";
import {filter, flatten, cloneDeep, find} from "lodash";
import * as componentService from "@services/componentService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";
import {useEffect, useState} from "react";
import ControlledAutocomplete from "@components/materialui/ControlledAutocomplete";
import {useForm} from "react-hook-form";
import {FailureModeProvider} from "@hooks/useFailureModes";

interface Props {
    component: Component,
    onComponentUpdated: (component: Component) => void,
    systemComponents: Component[],
}

const ComponentSidebarMenu = ({component, onComponentUpdated, systemComponents}: Props) => {
    const [showSnackbar] = useSnackbar();

    const allowedComponents = filter(flatten([systemComponents]), (o) => o.iri !== component?.iri)

    const {control, setValue} = useForm();
    const [linkComponent, setLinkComponent] = useState<Component | null>(component?.linkedComponent);
    useEffect(() => {
        setLinkComponent(component?.linkedComponent)
    }, [component])

    useEffect(() => {
        const c = find(flatten([systemComponents]), el => el.iri === component?.linkedComponent?.iri)
        setValue('linkedComponent', c)
    }, [linkComponent])

    const handleLinkedComponentChange = (linkedComponent: Component | null) => {
        if (linkedComponent) {
            componentService.linkComponent(component.iri, linkedComponent.iri)
                .then(value => onComponentUpdated(value))
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
            setLinkComponent(linkedComponent)
            component.linkedComponent = linkedComponent
        } else {
            componentService.unlinkComponent(component.iri)
                .then(value => {
                    const componentClone = cloneDeep(component);
                    componentClone.linkedComponent = null;
                    onComponentUpdated(componentClone)
                })
                .catch(reason => showSnackbar(reason, SnackbarType.ERROR))
            setLinkComponent(null)
            component.linkedComponent = null
        }
    }

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
                    <FailureModeProvider component={component}>
                        <ComponentFunctionsList/>
                        <ComponentFailureModesList component={component}/>
                    </FailureModeProvider>
                </FunctionsProvider>
                <Divider/>
            </React.Fragment>}

            {component && <React.Fragment>
                <Typography variant="h6" gutterBottom>Linked Component</Typography>
                <ControlledAutocomplete
                    control={control}
                    name="linkedComponent"
                    options={allowedComponents}
                    onChangeCallback={handleLinkedComponentChange}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Linked Component" variant="outlined"/>}
                    defaultValue={null}
                />

            </React.Fragment>}

        </React.Fragment>
    );
}

export default ComponentSidebarMenu;