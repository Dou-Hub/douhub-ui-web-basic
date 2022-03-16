import React from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'mobx-react';
import { useContextStore, useEnvStore, useMessageStore } from 'douhub-ui-store';

function AppBase(props: AppProps) {
  const { Component, pageProps } = props;
  const contextStore = useContextStore(pageProps.initialState);
  const envStore = useEnvStore(pageProps.initialState);
  const messageStore = useMessageStore(pageProps.initialState);
  return (
    <Provider envStore={envStore} contextStore={contextStore} messageStore={messageStore}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default AppBase
