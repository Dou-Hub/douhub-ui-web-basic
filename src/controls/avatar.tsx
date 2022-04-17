import React, { Fragment, useEffect, useState } from 'react';
import { isInteger, isNumber, isArray } from 'lodash';
import SVG from './svg';
import { isNonEmptyString, COLORS, stringToColor, getRecordDisplay } from 'douhub-helper-util'
import { Menu, Transition } from '@headlessui/react'
import { map } from 'lodash';
import { _track } from '../index';

const styles = {
    countWrapper: { position: 'absolute', top: -5, right: -5, borderRadius: 9, backgroundColor: COLORS.red, justifyContent: 'space-around' },
    count: { fontSize: 8, color: COLORS.white, alignSelf: 'center' }
}

const Avatar = (props: Record<string, any>) => {

    const { countWrapperStyle, countStyle, hide, count,
        menu, wrapperClassName,
        wrapperStyle, nameStyle, svgStyle,
        nameToColor, notUser, imgStyle } = props;

    const [data, setData] = useState<Record<string, any>>({});
  
    let backgroundColor = isNonEmptyString(props.backgroundColor) ? props.backgroundColor : COLORS.white;
    let borderColor = isNonEmptyString(props.borderColor) ? props.borderColor : COLORS.black;
    let color = isNonEmptyString(props.color) ? props.color : borderColor;
    const display = getRecordDisplay(data);
    

    if (nameToColor) {
        backgroundColor = stringToColor(display);
        borderColor = backgroundColor;
        color = COLORS.white;
    }

    useEffect(() => {
        if (isNonEmptyString(props.data?.id)) {
            setData(props.data);
        }
    }, [props.data])

    const size = isInteger(props.size) ? props.size : 38;
    let { firstName, lastName } = data;

    if (!isNonEmptyString(firstName) && !isNonEmptyString(firstName) && !notUser) {
        firstName = display.split(' ')[0];
        if (display.split(' ').length > 1) lastName = display.split(' ')[1];
    }

    //if (_track) console.log({ data })

    const renderName = () => {
        if (isNonEmptyString(data.avatar)) return null;
        return (isNonEmptyString(firstName) || isNonEmptyString(firstName)) ?
            <div className="flex flex-row items-center rounded-full border"
                style={{ minWidth: size, minHeight: size, borderColor, backgroundColor, ...nameStyle }}>
                <div className="flex flex-row justify-center w-full">
                    <span style={{ color }}>{isNonEmptyString(firstName) ? firstName.substring(0, 1).toUpperCase() : ''}</span>
                    <span style={{ color }}>{isNonEmptyString(lastName) ? lastName.substring(0, 1).toUpperCase() : ''}</span>
                </div>
            </div>
            :
            <SVG
                id="page-header-me"
                style={{ width: size, ...svgStyle }}
                color={color}
                src={notUser ? "/icons/my-location.svg" : "/icons/circle-user.svg"} />
    }

    const renderAvatar = () => {
        return isNonEmptyString(data.avatar) && <img className="rounded-full border border-gray-20" src={data.avatar} alt="" style={{ width: size, ...imgStyle }} />;
    }

    const renderUser = () => {
        return <Menu as="div" className="relative inline-block text-left">
            <Menu.Button
                className="flex text-sm"
                style={{ minWidth: size, minHeight: size }}
            >
                {renderName()}
                {renderAvatar()}
            </Menu.Button>
            {isNonEmptyString(props.data?.currentStatus) && <div className={`absolute right-0 top-0 rounded-full ${props.data?.currentStatus == 'on' ? 'bg-green-600' : 'bg-red-600'}`} style={{ width: 10, height: 10 }} />}
            {isArray(menu) && menu.length > 0 && <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="origin-top-right absolute z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {map(menu, (item, index:number) => {
                            return <Menu.Item key={`${item.title}-${index}`}>
                                {({ active }) => (
                                    <div
                                        onClick={item.onClick}
                                        className={`${active ? 'bg-gray-100' : ''} cursor-pointer block px-4 py-2 text-sm text-gray-700`}
                                    >
                                        {item.title}
                                    </div>
                                )}
                            </Menu.Item>
                        })}
                    </div>
                </Menu.Items>
            </Transition>
            }
        </Menu>
    }


    return hide ? null : <>

        <div
            className={`avatar ${data ? 'avatar-image-wrapper' : 'avatar-icon-wrapper'} ${isNonEmptyString(wrapperClassName) ? wrapperClassName : ''}`}
            style={{ width: size, height: size, position: 'relative', ...wrapperStyle }}>
            {renderUser()}
            {isNumber(count) && count > 0 &&
                <div
                    className="flex flex-row justify-center w-full" style={{ width: size / 2, height: size / 2, ...styles.countWrapper, ...countWrapperStyle }}>
                    <div style={{ ...styles.count, ...countStyle }}>{count > 9 ? '9+' : count}</div>
                </div>}
        </div>


    </>
}

export default Avatar