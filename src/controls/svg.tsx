import React from 'react';
import { ReactSVG } from 'react-svg';
import { isFunction } from 'lodash';
import { isNonEmptyString } from 'douhub-helper-util';
import CSS from './css';

const SVG_CSS = `
     .svg {
        line-height: 1;
        height: inherit;
        width: inherit;
    }
    .svg div,
    .svg svg
    {
        height: inherit;
        width: inherit;
    }
`

const SVG = (props: Record<string, any>) => {
    const { style } = props;
    const src = isNonEmptyString(props.src) ? props.src : '';
    const color = isNonEmptyString(props.color) ? props.color : '#000000';
    const id = `svg_${isNonEmptyString(props.id) ? props.id : src}`.replace(/[^A-Za-z0-9]+/g, '');
    const cssId = `svg-css-${id}-${color}`.replace(/[^A-Za-z0-9]+/g, '');

    // const [color, setColor] = useState(isNonEmptyString(props.color) ? props.color : '#000000');
    // const [id, setId] = useState(`svg_${isNonEmptyString(props.id) ? props.id : src}`.replace(/[^A-Za-z0-9]+/g, ''));

    // useEffect(() => {
    //     const newColor = isNonEmptyString(props.color) ? props.color : '#000000';
    //     const newId = `svg_${isNonEmptyString(props.id) ? props.id : src}`.replace(/[^A-Za-z0-9]+/g, '');
    //     setColor(newColor);
    //     setId(newId);
    // }, [props.color, src, props.id])


    const onClick = () => {
        if (isFunction(props.onClick)) props.onClick();
    }

    return <>
        <CSS id="svg-css" content={SVG_CSS} />
        {isNonEmptyString(color) && <CSS id={cssId} content={`
            #${id} .svg svg
            {
                fill: ${color};
            }

            #${id} .svg svg path
            {
                fill: ${color};
            }
        `} />}
        {isNonEmptyString(src) && <div id={id} onClick={onClick}
            style={style}
            className={`svg-wrapper 
        ${isNonEmptyString(props.className) ? props.className : ''}`}>
            <ReactSVG src={src} className="svg" />
        </div>}
    </>
}

SVG.displayName = 'controls.svg';
export default SVG;