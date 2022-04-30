//  Copyright PrimeObjects Software Inc. and other contributors <https://www.primeobjects.com/>
// 
//  This source code is licensed under the MIT license.
//  The detail information can be found in the LICENSE file in the root directory of this source tree.

import AppBase from './app';

export { abortCallAPI, callAPIBase, APISettings } from './call-api';
export { callAPI } from './context/auth-call-api';
export { signIn, getAuth, signInCognito, getCurrentPoolUser, signOut } from './context/auth-cognito';
export { useCurrentContext } from './context/use-current-context';

import View from './controls/view';
import Text from './controls/text';
import SVG from './controls/svg';
import Triangle from './controls/triangle';
import CSS from './controls/css';
import Div from './controls/div';
import Nothing from './controls/nothing';
import Avatar from './controls/avatar';
import Card from './controls/card';
import Tags from './controls/tags';
import BasicModal from './controls/basic-modal';
import Tooltip from './controls/tooltip';
import Recaptcha, { getRecaptchaToken } from './controls/recaptcha';

export { ARTICLE_CSS } from './article-css';

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
    AppBase, View, Text, CSS, Div, Nothing, SVG, Avatar, Triangle,
    Recaptcha, getRecaptchaToken, Tags, Card, BasicModal, Tooltip
}

