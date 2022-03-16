import React from 'react';

const Triangle = (props: {
    size: number,
    direction: 'up' | 'down' | 'right' | 'left',
    backgroundColor?: string,
    foreColor?: string,
    style?: Record<string, any>
}) => {
    const { size, style, direction } = props;
    const foreColor = props.foreColor ? props.foreColor : 'rgb(249,250,251)';
    const backgroundColor = props.backgroundColor ? props.backgroundColor : 'rgb(255,255,255)';

    return <div style={{
        width: 0,
        height: 0,

        ... (direction == 'down' ? { borderTop: `${size}px solid ${foreColor}` } : {}),
        ... (direction == 'up' ? { borderBottom: `${size}px solid ${foreColor}` } : {}),
        ... (direction == 'right' || direction == 'left' ? { borderTop: `${size}px solid ${backgroundColor}` } : {}),
        ... (direction == 'right' || direction == 'left' ? { borderBottom: `${size}px solid ${backgroundColor}` } : {}),
       
        ... (direction == 'right' ? { borderLeft: `${size}px solid ${foreColor}` } : {}),
        ... (direction == 'left' ? { borderRight: `${size}px solid ${foreColor}` } : {}),
        ... (direction == 'up' || direction == 'down' ? { borderLeft: `${size}px solid ${backgroundColor}` } : {}),
        ... (direction == 'up' || direction == 'down' ? { borderRight: `${size}px solid ${backgroundColor}` } : {}),
        ...style
    }}></div>
}

export default Triangle;