import React, { useEffect, useState } from 'react';
import { _window } from '../util';
import { SPLITTER_CSS } from './splitter-css';
import CSS from './css'
import SplitterInternal from './splitter-internal';

const Splitter = (props: Record<string, any>) => {

    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, [_window])

    return <>
        <CSS id="splitter-css" content={SPLITTER_CSS} />
        {show ? <SplitterInternal {...props} /> : <div style={{ display: 'none' }}></div>}
    </>
}

export default Splitter;