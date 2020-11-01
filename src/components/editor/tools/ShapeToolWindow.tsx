import * as React from "react";
import useStyles from "./ShapeToolWindow.styles";
import {Divider, Paper, Typography} from "@material-ui/core";
import {TreeNode, TreeNodeType} from "@models/treeNodeModel";
import {Event} from "@models/eventModel";
import FaultEventCreation from "@components/dialog/faultEvent/FaultEventCreation";

interface ShapeToolWindowProps {
    data: TreeNode<Event>
}

const ShapeToolWindow = ({data}: ShapeToolWindowProps) => {
    const classes = useStyles()

    // const editPane = if(data.nodeType === TreeNodeType.EVENT) {
    //     <FaultEventCreation useFormMethods={useFormMethods} topEventOnly={false}/>
    // } else {}

    return (
        <Paper className={classes.paper} elevation={3}>
            <Typography className={classes.title} variant="h5" gutterBottom>Edit Event</Typography>
            <Divider/>
            <p>{JSON.stringify(data)}</p>

        </Paper>
    );
}

export default ShapeToolWindow;