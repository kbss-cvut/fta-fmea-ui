import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {useEffect} from "react";

const Portal = (props) => {
    let defaultNode;

    useEffect(() => {
        renderPortal(props)

        return () => {
            ReactDOM.unmountComponentAtNode(defaultNode || props.node);
            if (defaultNode) {
                document.body.removeChild(defaultNode);
            }
            defaultNode = null;
        }
    })

    const renderPortal = (props) => {
        if (!props.node && !defaultNode) {
            defaultNode = document.createElement('div');
            document.body.appendChild(defaultNode);
        }

        let children = props.children;
        // https://gist.github.com/jimfb/d99e0678e9da715ccf6454961ef04d1b
        if (typeof children.type === 'function') {
            children = React.cloneElement(children);
        }

        ReactDOM.render(children, props.node || defaultNode);
    }

    return null;
}

export default Portal;