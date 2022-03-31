import { cloneDeep, each, isArray, isNil } from "lodash";
import React, {useEffect, useState} from "react";

const Div = (props: Record<string, any>) => {

    const [params, setParams] = useState<Record<string,any>|null>(null);
    const show = !isNil(params);

    useEffect(()=>{
        const newParams = cloneDeep(props);
        if (isArray(props.removeProps))
        {
            each(props.removeProps, (rp:string)=>{
                delete newParams[rp];
            });
            delete newParams.removeProps;
        }
        setParams(newParams);
    },[]);

    return show?<div {...params}>
        {props.children}
    </div>:<></>
};

export default Div;