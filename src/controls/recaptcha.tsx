import React, { useEffect } from 'react';
import {isFunction} from 'lodash';
import {isNonEmptyString} from 'douhub-helper-util';
import {_window} from '../index';

export const getRecaptchaToken = (id: string) => {
    const elemId = isNonEmptyString(id) ? `recaptcha_${id}` : '';
    return isNonEmptyString(elemId) && _window.grecaptcha.enterprise.getResponse(_window[elemId]);
}


const Recaptcha = (props: Record<string,any>) => {

    const { style, className } = props;
    const id = isNonEmptyString(props.id) ? `recaptcha_${props.id}` :`recaptcha_core`;
    const scriptId = `${id}_script`;
    const functionId = `${id}_onLoadRecaptcha`.replace(/-/g,'').replace(/_/g,'');
    const solution = _window.solution;
    
    useEffect(() => {

        if (isNonEmptyString(id) && !document.getElementById(scriptId)) {

            if (!isFunction(_window[functionId])) {
                _window[functionId] = () => {
                    _window[id] = _window.grecaptcha.enterprise.render(id, {
                        sitekey: solution.keys.recaptchaSiteKey,
                        theme: 'light'
                    });
                }

                _window[scriptId] = document.createElement("script");
                _window[scriptId].id = scriptId;
                _window[scriptId].src = `https://www.google.com/recaptcha/enterprise.js?onload=${functionId}&render=explicit`;
                document.body.appendChild(_window[scriptId]);
            }
        }

        return () => {
            if (_window[functionId]) _window[functionId] = null;
            if (_window[scriptId]) _window[scriptId].remove();
        }

    }, [_window.location])

    return <div id={id} style={style} className={className}></div>
};

export default Recaptcha;
