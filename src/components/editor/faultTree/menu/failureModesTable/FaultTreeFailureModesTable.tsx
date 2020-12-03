import {
    Divider,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@material-ui/core";
import * as React from "react";
import {useCurrentFaultTreeTable} from "@hooks/useCurrentFaultTreeTable";
import {Link as RouterLink} from "react-router-dom";
import {ROUTES} from "@utils/constants";
import {extractFragment} from "@services/utils/uriIdentifierUtils";
import FaultEventShapeToolPane from "@components/editor/faultTree/menu/faultEvent/FaultEventShapeToolPane";

const FaultTreeFailureModesTable = () => {
    const table = useCurrentFaultTreeTable();

    return (
        <React.Fragment>
            {
                table ?
                    <React.Fragment>
                        <Typography variant="h5" gutterBottom>Corresponding FMEA Table:</Typography>
                        <List>
                            <ListItemLink to={ROUTES.FMEA + extractFragment(table.iri)} primary={table.name}/>
                        </List>
                        <Divider/>
                    </React.Fragment>
                    :
                    <Typography/>
            }
        </React.Fragment>
    );
}

const ListItemLink = ({primary, to}) => {
    const renderLink = React.useMemo(() => {
        // @ts-ignore
        return React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />)
    }, [to],);

    return (
        <li>
            <ListItem button component={renderLink}>
                <ListItemText primary={primary}/>
            </ListItem>
        </li>
    );
}

export default FaultTreeFailureModesTable;
