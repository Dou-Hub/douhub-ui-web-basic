//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.


import { useEffect, useState } from 'react';
import { callAPI } from './auth-call-api';
import { isFunction, isBoolean, cloneDeep } from 'lodash';
import { isNonEmptyString, isObject } from 'douhub-helper-util';
import { _window, _track } from "../util";
import { useRouter } from 'next/router';
import { useContextStore } from 'douhub-ui-store';

export const useCurrentContext = (solution: Record<string, any>, settings?: {
    signInUrl?: '/auth/sign-in',
    needAuthorization?: boolean,
    skipAuthentication?: boolean,
    needSolution?: boolean,
    onSuccess?: any,
    onError?: any,
    context?: Record<string, any>,
    recordId?: string,
    needRecord?: string
    recordIdByMembership?: string,
    needRecordByMembership?: string,
    apiUrl?: string
}) => {
    const router = useRouter();
    const [context, setContext] = useState<Record<string, any> | null>(null);
    const contextStore = useContextStore();

    useEffect(() => {
        if (!context && _window) {

            if (!settings) settings = {
                signInUrl: '/auth/sign-in',
                needAuthorization: true,
                onSuccess: null,
                onError: null
            }

            if (!isBoolean(settings.needAuthorization)) settings.needAuthorization = true;
            if (!isBoolean(settings.needSolution)) settings.needSolution = false;

            const apiParams: Record<string, any> = {
                needAuthorization: settings.needAuthorization == true,
                skipAuthentication: settings.skipAuthentication == true,
                needSolution: settings.needSolution == true
            };

            if (isNonEmptyString(settings.recordId)) apiParams.recordId = settings.recordId;
            if (isNonEmptyString(settings.recordIdByMembership)) apiParams.recordIdByMembership = settings.recordIdByMembership;

            if (isNonEmptyString(settings.needRecord)) apiParams.needRecord = settings.needRecord;
            if (isNonEmptyString(settings.needRecordByMembership)) apiParams.needRecordByMembership = settings.needRecordByMembership;

            callAPI(solution, settings.apiUrl ? settings.apiUrl : `${solution.apis.context}current`, apiParams, 'GET')
                .then((result: Record<string, any>) => {
                    const settingContext: any = isObject(settings?.context) ? cloneDeep(settings?.context) : {};
                    const currentContext = result.context;

                    if (isObject(settingContext.recordByMembership)) {
                        currentContext.recordByMembership = {
                            ...(isObject(currentContext.recordByMembership) ? currentContext.recordByMembership : {}),
                            ...settingContext.recordByMembership
                        }
                    }

                    if (isObject(settingContext.organization)) {
                        currentContext.organization = {
                            ...(isObject(currentContext.organization) ? cloneDeep(currentContext.organization) : {}),
                            ...settingContext.organization
                        }
                    }

                    if (isObject(settingContext.user)) {
                        currentContext.user = {
                            ... (isObject(currentContext.user) ? cloneDeep(currentContext.user) : {}),
                            ...settingContext.user
                        }
                    }

                    setContext(currentContext);
                    contextStore.setData(currentContext);
                    if (isFunction(settings?.onSuccess)) {
                        settings?.onSuccess(currentContext);
                    }
                })
                .catch((error: any) => {
                    if (_track) console.error(error);
                    if (isFunction(settings?.onError)) {
                        settings?.onError(error);
                    }
                    else {
                        if (settings?.signInUrl) router.push(settings.signInUrl);
                    }
                })
        }
    }, [_window]);

    return context;
}