
import React from 'react';
import { colorByName } from 'douhub-helper-util';
import { Button } from 'antd';
import { _track } from '../../util';
if (_track) console.log('Load Ant Button');

const ButtonCSS = () => <style global={true} jsx={true}>{`

    .ant-btn-success
    {
        background-color: ${colorByName('lightGreen', 700)} !important;
        border-color: ${colorByName('lightGreen', 800)}  !important;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .ant-btn-success:hover
    {
        background-color: ${colorByName('lightGreen', 600)} !important;
    }

    .ant-btn-success span
    {
        color: #ffffff
    }

    .ant-btn-info
    {
        background-color: ${colorByName('lightBlue', 700)} !important;
        border-color: ${colorByName('lightBlue', 800)}  !important;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .ant-btn-info:hover
    {
        background-color: ${colorByName('lightBlue', 600)} !important;
    }

    .ant-btn-info span
    {
        color: #ffffff
    }

`}
</style>

ButtonCSS.displayName = 'ButtonCSS';


const AntButton = (props: Record<string, any>) => {
    return (
        <>
            <ButtonCSS />
            <Button {...props} />
        </>
    )
}

AntButton.displayName = 'AntButton';
export default AntButton;