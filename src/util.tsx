
import nookies from 'nookies';
import { isObject, isNonEmptyString, ttl } from 'douhub-helper-util';
import { isNil, isInteger, isNumber, isArray } from 'lodash';

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

export const _window: any = typeof window !== "undefined" ? window : {};
export const _process: any = typeof process !== "undefined" ? process : {};;
export const _track = `${publicRuntimeConfig.track}`.toLowerCase() == 'true' || `${_process?.env?.TRACK}`.toLowerCase() == 'true';

// export const getPlatformApiEndpoint = (appSettings: Record<string, any>, apiName: string, functionName: string, country?: string): string => {
//     return `${appSettings.platformEndpoint
//         .replace('{name}', apiName)
//         .replace('{stage}', appSettings.stage)
//         .replace('{country}', country ? country : appSettings.country)}/${functionName}`;
// }

export const getCookie = (name: string, ctx?: any) => {
    const o = nookies.get(ctx);
    if (!isObject(o)) return '';
    const v = nookies.get(ctx)[name];
    return v ? v : '';
};

export const setCookie = (name: string, value: string, ctx?: any, maxAgeMins?: number) => {
    if (!isNumber(maxAgeMins)) maxAgeMins = 360;
    const option = { path: "/", maxAge: maxAgeMins * 60 };
    nookies.set(ctx, name, value, option);
};

export const removeCookie = (name: string, ctx?: any) => {
    nookies.destroy(ctx, name, { path: "/" });
};

export const logDynamic = (object: Record<string, any>, url: string, name: string) => {
    if (isNonEmptyString(name)) {
        if (_track) console.log(`Dynamic load ${url} ${name}`);
    }
    else {
        if (_track) console.log(`Dynamic load ${url}`);
    }
    return object;
}

export const getLocalStorage = (key: string, defaultValue?: any) => {

    if (!isNonEmptyString(key)) return null;

    let data = null;
    const storageData = _window.localStorage.getItem(key);
    try {
        data = JSON.parse(storageData ? storageData : '{}');
        if (isObject(data) && isInteger(data.ttl) && Date.now() > data.ttl * 1000) //ttl in seconds
        {
            return !isNil(defaultValue) ? defaultValue : null;
        }
    }
    catch (error) {
        data = storageData;
    }

    return !isNil(data) ? data : (!isNil(defaultValue) ? defaultValue : null);
};


export const setLocalStorage = (key: string, data: any, expireMinutes?: number) => {

    if (!isNonEmptyString(key)) return null;
    if (isNil(data)) return _window.localStorage.removeItem(key);

    if (expireMinutes && isInteger(expireMinutes) && expireMinutes > 0) {
        const storageData = { data, ttl: ttl(expireMinutes) };
        _window.localStorage.setItem(key, JSON.stringify(storageData));
    }
    else {
        _window.localStorage.setItem(key, isObject(data) ? JSON.stringify(data) : data);
    }

};

export const removeLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};

export const hasErrorType = (error: Record<string, any>, type: string): boolean => {
    if (!isArray(error?.types) || isNonEmptyString(type)) return false;
    return (`,${error.types.join(',')},`).toUpperCase().indexOf(`,${type.toUpperCase()},`) >= 0
}

