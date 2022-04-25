import React from 'react';
import { isArray, isFunction, isNumber, map, uniq, find } from 'lodash';
import { shortenString, isNonEmptyString } from 'douhub-helper-util';
import Tooltip from './antd/tooltip';
import { useEnvStore } from 'douhub-ui-store';

const Tags = (props: {
    tags: string[],
    selectedTags?:string[],
    maxTagLength?:number,
    tooltipColor?:string,
    tagClassName?:string,
    textClassName?:string,
    wrapperClassName?:string,
    onClick?:(tag:string)=>void,
}) => {
   
    const { tags } = props;
    const selectedTags = isArray(props.selectedTags)?props.selectedTags:[];
    const tooltipColor = isNonEmptyString(props.tooltipColor)?props.tooltipColor:'#aaaaaa';
    const maxLength = isNumber(props.maxTagLength) ? props.maxTagLength : 12;
    const className = `cursor-pointer float-left flex h-5 items-center mb-1 rounded-lg whitespace-nowrap bg-gray-50 mr-2 px-1 my-1 leading-none self-center px-2 py-1 shadow hover:shadow-md ${isNonEmptyString(props.tagClassName) ? props.tagClassName : ''}`;
    const wrapperClassName = `w-full block text-2xs ${isNonEmptyString(props.wrapperClassName) ? props.wrapperClassName : ''}`;
    const envStore = useEnvStore();
    const envData = JSON.parse(envStore.data);

    const onClick = (tag: string) => {
        if (isFunction(props.onClick)) {
            props.onClick(tag);
        }
        else {
            let tags = envData['tags'];
            if (!isArray(tags)) tags = [];
            tags.push(tag);
            envStore.setValue('tags', uniq(tags));
        }
    }

    return isArray(tags) && tags.length > 0 ? <div className={wrapperClassName}>
        {map(isArray(tags) ? tags : [], (tag: string, index: number) => {

            const selected = find(selectedTags, (selectedTag: string) => {
                return selectedTag.toLowerCase() == tag.toLowerCase();
            });

            const textClassName = `leading-none ${selected?'search-highlight':''} ${isNonEmptyString(props.textClassName) ? props.textClassName : ''}`;

            let shortTag = shortenString(tag, maxLength);
            if (shortTag == tag) {
                return <div key={index} onClick={() => onClick(tag)}
                    style={{ width: 'max-content' }}
                    className={className}>
                        <span className={textClassName}>{shortTag}</span>
                    </div>
            }
            else {
                return <Tooltip key={index} color={tooltipColor} placement='top' title={tag}>
                    <div onClick={() => onClick(tag)}
                        style={{ width: 'max-content' }}
                        className={className}>
                            <span className={textClassName}>{shortTag}</span>
                        </div>
                </Tooltip>
            }
        })}</div> : null;
}

export default Tags;