
import React from "react";
import { isNonEmptyString } from 'douhub-helper-util';

const Text = (props: Record<string, any>) => {
    const { html } = props;
    return isNonEmptyString(html) ?
        <div {...props} dangerouslySetInnerHTML={{ __html: html }}></div> :
        <div {...props}>{props.children}</div>
};

Text.displayName = 'controls.text';
export default Text;