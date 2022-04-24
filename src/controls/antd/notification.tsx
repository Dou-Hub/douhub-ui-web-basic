
import { notification } from 'antd';
import { isNonEmptyString } from 'douhub-helper-util';
import React, { useEffect } from 'react';
import { _track } from '../../util';
if (_track) console.log('Load Ant Notification');

const AntNotification = (props: {id:string, message?:string, description?:string, type?:string, placement?:string}) => {

    const { message, description, type, placement, id } = props;

    useEffect(() => {
        if (isNonEmptyString(message) || isNonEmptyString(description))
        {
            notification[type ? type : 'info']({
                message,
                description,
                placement: placement ? placement : 'topRight'
            });
        }
    }, [message, description, type, placement, id])

    return <></>
}

AntNotification.displayName = 'AntNotification';
export default AntNotification;