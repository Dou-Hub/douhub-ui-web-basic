//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import AppBase from './app';

export { abortCallAPI, callAPIBase, APISettings } from './call-api';
export { callAPI } from './context/auth-call-api';
export { signIn, getAuth, signInCognito, getCurrentPoolUser, signOut, useCurrentContext } from './context/auth-cognito';

import View from './controls/view';
import Text from './controls/text';
import SVG from './controls/svg';
import Triangle from './controls/triangle';
import CSS from './controls/css';
import Div from './controls/div';
import Avatar from './controls/avatar';


export {
    getLocalStorage,
    setLocalStorage,
    removeLocalStorage,
    hasErrorType,
    getCookie,
    setCookie,
    removeCookie,
    logDynamic,
    _window,
    _process,
    _track
} from './util';

export {
    AppBase, View, Text, CSS, Div, SVG, Avatar, Triangle
}

