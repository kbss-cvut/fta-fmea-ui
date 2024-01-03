import * as React from "react";
import {useEffect} from "react";
import {Button, TextField} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Component, UpdateComponent} from "@models/componentModel";
import {schema} from "../../../../dialog/component/Component.schema";
import * as componentService from "@services/componentService";
import {SnackbarType, useSnackbar} from "@hooks/useSnackbar";

interface Props {
    component: Component,
    onComponentUpdated: (component: Component) => void,
}

const ComponentEditMenu = ({component, onComponentUpdated}: Props) => {
    const [showSnackbar] = useSnackbar();

    const {control, register, formState: { errors }, handleSubmit, formState, reset} = useForm({
        resolver: yupResolver(schema),
    });
    const {isSubmitting, isDirty} = formState;

    const defaultValues = {
        name: component.name,
    }

    const handleComponentUpdate = async (values: any) => {
        const updateComponent = {
            uri: component.iri,
            name: values.name
        } as UpdateComponent

        componentService.update(updateComponent)
            .then(value => onComponentUpdated(value))
            .catch(reason => showSnackbar(reason, SnackbarType.ERROR));
    }


    useEffect(() => {
        // @ts-ignore
        reset(defaultValues)
    }, [component])

    return (
        <React.Fragment>
            <TextField autoFocus margin="dense" id="component-name-edit" label="Component Name"
                       type="text" fullWidth name="name" defaultValue={component.name} error={!!errors.name} {...register("name")}/>
            {isDirty &&
            <Button disabled={isSubmitting} color="primary" onClick={handleSubmit(handleComponentUpdate)}>
                Save
            </Button>
            }
        </React.Fragment>
    );
}

export default ComponentEditMenu;