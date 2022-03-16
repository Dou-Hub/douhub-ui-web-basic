import React from "react";
const View = (props: Record<string, any>) => {
    return <div {...props} style={{ display: 'flex', flexDirection: 'row', ...props.style }}>
        {props.children}
    </div>;
};

View.displayName = 'controls.view';
export default View;