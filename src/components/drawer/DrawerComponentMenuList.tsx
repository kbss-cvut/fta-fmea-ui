import * as React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import {useState} from "react";
import * as componentService from "@services/componentService"
import {useEffectAsync} from "@utils/hookUtils";
import {Component} from "@models/componentModel";

const DrawerComponentMenuList = () => {
    const [components, setComponents] = useState([])

    useEffectAsync(async () => {
        const componentList = await componentService.findAll();
        console.log(componentList);
        setComponents(componentList)
    }, []);

    return (
        <List>
            {
                components.map((value: Component) => (
                    <ListItem button key={value.iri}>
                        <ListItemText primary={value.name}/>
                    </ListItem>
                ))
            }
        </List>
    );
}

export default DrawerComponentMenuList;