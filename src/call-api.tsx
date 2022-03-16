import { isNonEmptyString, isObject, isObjectString, getWebLocation } from 'douhub-helper-util';
import { isNil, isEmpty } from 'lodash';
import axios, { Method } from 'axios';
import { _window, _track } from "./util";

export const abortCallAPI = () => {
    if (isEmpty(_window)) return;
    return new _window.AbortController;
}

const processServerlessOfflineError = (message: string): Record<string, any> | null => {
    try {
        const result = JSON.parse(message);
        const error: Record<string, any> = JSON.parse(result.body);
        return error;
    }
    catch
    {
        console.error({ error: 'Failed to process the error from the offline API.', message });
        return null;
    }
    // try {
    //     message = message
    //         .replace('{errorMessage=', '{"errorMessage":')
    //         .replace('statusCode=', '"statusCode":')
    //         .replace('headers=', '"headers":"')
    //         .replace('errorType=Error', '"errorType":"Error"')
    //         .replace('body=', '", "body:')
    //         .replace('"body":"', '"body":')
    //         .replace(/\\"/g, '"');

    //     message = message.substring(0, message.indexOf('stackTrace=')).substring(0, message.indexOf('"errorType":"Error"'))
    //     message = message.substring(0, message.length - 4) + "}}";
    //     return JSON.parse(message).errorMessage;
    // }
    // catch
    // {
    //     console.error({ error: 'Failed to process the result from the offline API.', message });
    //     return null;
    // }
}


export type APISettings = {
    apiToken?: string,
    headers?: any,
    solutionId?: string,
    stage?: 'dev' | 'staging' | 'prod'
}

export const callAPIBase = (
    url: string,
    data: Record<string, any>,
    method: Method,
    settings?: APISettings): Promise<Record<string, any>> => {

    if (!isObject(settings)) settings = {};
    if (isNil(data)) data = {};

    let headers: Record<string, any> = {
        ...settings?.headers,
        Accept: 'application/json,application/xml,text/plain,text/html,*.*',
        // 'Content-Type': 'application/x-www-form-urlencoded'
    };

    if (settings?.solutionId) {
        headers.solutionId = settings.solutionId;
    }

    if (isNonEmptyString(settings?.apiToken)) {
        headers.apiToken = settings?.apiToken;
    }

    const webL = getWebLocation(`${_window.location}`);
    if (webL && webL.host)
    {
        const port = !isNonEmptyString(webL.port) || webL.port=='80'?'':`:${webL.port}`;
        headers.domain = `${webL.host}${port}`;
    }

    const config: Record<string, any> = {
        url,
        method,
        headers
    }

    // if (method === 'GET') {
    //     let params = Object.keys(data).map((key) => {
    //         let v = data[key];
    //         if (isArray(v) || isObject(v)) v = JSON.stringify(v);
    //         return encodeURIComponent(key) + '=' + encodeURIComponent(v);
    //     }).join('&');

    //     if (params.length > 0) url = url.indexOf('?') > 0 ? `${url}&${params}` : `${url}?${params}`;
    // }

    if (method.toUpperCase() === 'GET') {
        if (isObject(data)) config.params = data;
    }
    else {
        if (isObject(data)) config.data = data;
    }

    return new Promise((resolve, reject) => {
        const localAPI = url.indexOf('//localhost') > 0;
        axios(config)
            .then((result: Record<string, any>) => {

                if (_track) console.log({ callAPIBaseResult: result });

                let data = result.data;
                let body:Record<string,any> = {};

                if (isNonEmptyString(data?.body))
                {
                    try
                    {
                        body = JSON.parse(data?.body);
                        resolve(body);
                    }
                    catch
                    {
                        body = {};
                    }
                }

                if (isObject(data) && (data.errorType || data.errorMessage)) {
                    throw data;
                }

                if (isObject(data) && data.type == 'error') {
                    throw data;
                }

                if (isObject(data) && isObject(data.error)) {
                    throw data.error;
                }

                if (isObject(data) && data.statusCode === 200) {
                    data = data.body;
                }
                // console.log({ data})
                resolve(data);
            })
            .catch((exception: Record<string, any>) => {

                console.error({ exception });

                let error: Record<string, any> = {};

                if (localAPI) {
                    const processResult = processServerlessOfflineError(exception?.response?.data?.errorMessage);
                    if (isNil(processResult)) reject(exception);
                    error = !isNil(processResult) ? processResult : {};
                }

                if (isEmpty(error)) {
                    if (isObjectString(exception?.response?.data?.body)) {
                        error = JSON.parse(exception?.response?.data?.body);
                    }
                    else {
                        error.message = exception.message;
                        error.code = 500;
                    }
                }

                if (error.message && !error.statusMessage) error.statusMessage = error.message;
                if (error.name && !error.statusName) error.statusName = error.name;
                if (error.code && !error.statusCode) error.statusCode = error.code;

                reject(error);
            });

    });

}
