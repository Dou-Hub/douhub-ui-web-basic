import React from 'react';
import { isArray, isFunction, isNumber, map, uniq, find, isNil } from 'lodash';
import { shortenString, isNonEmptyString, isObject } from 'douhub-helper-util';
import { useEnvStore } from 'douhub-ui-store';
import ITooltip from './tooltip';

const Tags = (props: {
    tags: string[],
    selectedTags?: string[],
    maxTagLength?: number,
    tooltipColor?: string,
    tagClassName?: string,
    tagStyle?: Record<string, any>,
    textClassName?: string,
    wrapperClassName?: string,
    onClick?: (tag: string) => void,
    disableShorten?:boolean,
    Tooltip?: any
}) => {

    const { tags, disableShorten } = props;
    const selectedTags = isArray(props.selectedTags) ? props.selectedTags : [];
    const tooltipColor = isNonEmptyString(props.tooltipColor) ? props.tooltipColor : '#aaaaaa';
    const maxLength = isNumber(props.maxTagLength) ? props.maxTagLength : 12;
    const tagClassName = `cursor-pointer float-left flex text-sm text-gray-800 h-6 items-center rounded-lg whitespace-nowrap bg-gray-50 border-gray-100 mr-2 my-1 leading-none self-center px-2 py-2 shadow hover:shadow-lg ${isNonEmptyString(props.tagClassName) ? props.tagClassName : ''}`;
    const tagStyle = isObject(props.tagStyle) ? props.tagStyle : {};
    const wrapperClassName = `w-full block ${isNonEmptyString(props.wrapperClassName) ? props.wrapperClassName : ''}`;
    const envStore = useEnvStore();
    const envData = JSON.parse(envStore.data);
    const Tooltip = isNil(props.Tooltip) ? ITooltip : props.Tooltip;
   
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

            const textClassName = `leading-none ${selected ? 'search-highlight' : ''} ${isNonEmptyString(props.textClassName) ? props.textClassName : ''}`;

            let shortTag = !disableShorten ? shortenString(tag, maxLength) : tag;
            if (shortTag == tag) {
                return <div key={index} onClick={() => onClick(tag)}
                    style={{ width: 'max-content', ...tagStyle }}
                    className={tagClassName}>
                    <span className={textClassName}>{shortTag}</span>
                </div>
            }
            else {
                return <Tooltip key={index} color={tooltipColor} placement='top' title={tag}>
                    <div onClick={() => onClick(tag)}
                        title=""
                        style={{ width: 'max-content', ...tagStyle }}
                        className={tagClassName}>
                        <span className={textClassName}>{shortTag}</span>
                    </div>
                </Tooltip>
            }
        })}</div> : null;
}

export default Tags;