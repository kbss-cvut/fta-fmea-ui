import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() =>
    ({
        failureModes: {
            width: '100%'
        },

        actionButton: {
            alignSelf: 'flex-end'
        },

        editHeader:{
            display: 'flex',
            justifyContent: 'space-between'
        },

        closure :{
            color: "#A9A9A9"
        },

        menuPaper: {
            maxHeight: 500,
            maxWidth: 300
        }
    }));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
