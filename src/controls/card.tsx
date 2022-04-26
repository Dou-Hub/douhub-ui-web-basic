import React from 'react';
import { isNonEmptyString, isObject } from 'douhub-helper-util';
import { isFunction, isArray } from 'lodash';
import Tags from './tags';

export const Card = (props: Record<string, any>) => {

    const { media, item, display, content, tags, tooltipColor, className, style } = props;

    const onClick = () => {
        if (isFunction(props.onClick)) props.onClick(item);
    }

    const onLoadImageSuccess = () => {
        if (isFunction(props.onLoadImage)) props.onLoadImage(media, true);
        if (isFunction(props.onLoadImageSuccess)) props.onLoadImageSuccess(media);
    }

    const onLoadImageError = () => {
        if (isFunction(props.onLoadImage)) props.onLoadImage(media, false);
        if (isFunction(props.onLoadImageError)) props.onLoadImageError(media);
    }

    return <div
        style={isObject(style) ? style : {}}
        className={`flex flex-col rounded-lg border border-gray-100 overflow-hidden hover:shadow-lg ${isNonEmptyString(className) ? className : ''}`}>
        {isNonEmptyString(media) && <div className="flex-shrink-0 cursor-pointer" onClick={onClick}>
            <img className="w-full" src={media} alt="" onLoad={onLoadImageSuccess} onError={onLoadImageError} />
        </div>}
        <div className="flex-1 bg-white p-4 flex flex-col justify-between" >
            <div className="flex-1 overflow-hidden">
                <div className="w-full block mt-2 flex flex-col">
                    <div className="w-full text-base mb-2 font-semibold text-gray-900 leading-5 cursor-pointer" dangerouslySetInnerHTML={{ __html: display }} onClick={onClick} />
                    {isArray(item.tags) && item.tags.length > 0 && <div className="w-full">
                        <Tags tags={item.tags} wrapperClassName="mt-1" selectedTags={tags} tooltipColor={tooltipColor} />
                    </div>}
                    <div className="w-full mt-2 text-sm text-gray-500 cursor-pointer" dangerouslySetInnerHTML={{ __html: content }} onClick={onClick} />
                </div>
            </div>
        </div>
    </div>
}

export default Card