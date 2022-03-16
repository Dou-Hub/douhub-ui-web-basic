import React from "react";
const Div = (props: Record<string, any>) => {
    return <div {...props}>
        {props.children}
    </div>;
};

export default Div;