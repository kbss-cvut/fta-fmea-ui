import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles(() => {
        return createStyles({
            root: {
                display: "flex",
                flexFlow: "column",
                height: "100vh"
            }
        })
    }
);

export default useStyles;