import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() =>
    ({
        creationBox: {
            display: 'inline-flex',
            width: '100%'
        },

        addButton: {
            alignSelf: 'flex-end'
        }
    }));

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export default useStyles;
