import { isObject } from 'douhub-helper-util';
import { getCurrentPoolUser } from './auth-cognito';
import { Method } from 'axios';
import { isEmpty } from 'lodash';
import { callAPIBase, APISettings } from '../call-api';
import { getAuth } from '..';
import { _track } from '../util';


export const callAPI = async (
    solution: Record<string, any>,
    url: string,
    data: Record<string, any>,
    method: Method,
    settings?: APISettings): Promise<Record<string, any>> => {

    if (!isObject(solution)) {
        return await callAPIBase(url, data, method, settings);
    }

    const auth = await getAuth(solution);
    if (!isObject(settings)) settings = {};
    if (settings) settings.solutionId = solution.id;

    return new Promise((resolve, reject) => {
        getCurrentPoolUser(auth)
            .then((cognito: any) => {
                if (_track) console.log({ cognito });
                if (settings) settings.headers = {};
                if (settings && !isEmpty(cognito)) {
                    settings.headers.Authorization = cognito.signInUserSession.idToken.jwtToken;
                    settings.headers.AccessToken = cognito.signInUserSession.accessToken.jwtToken;
                }
                if (_track) console.log('getCurrentPoolUser->yes->callAPIBase');
                callAPIBase(url, data, method, settings)
                    .then(resolve)
                    .catch((error: any) => {
                        reject(error);
                    });
            })
            .catch(() => {
                if (_track) console.log('getCurrentPoolUser->no->callAPIBase');
                callAPIBase(url, data, method, settings)
                    .then(resolve)
                    .catch((error: any) => {
                        reject(error);
                    });
            });
    });
}