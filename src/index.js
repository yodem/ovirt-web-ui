// @flow
/**
 Flow agreement:
 For simple types, like number, boolean, string and etc.: use lower-case,
 For complex types, like Object, Array and etc.: use first letter in upper-case
 **/

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import { type Task } from 'redux-saga'

import '_/logger' // initialize our console logging overlay

import '@patternfly/react-core/dist/styles/base.css'
import 'patternfly/dist/css/patternfly.css'
import 'patternfly/dist/css/patternfly-additions.css'
import 'patternfly-react/dist/css/patternfly-react.css'
import './index-nomodules.css'
import * as branding from '_/branding'

import { getSelectedMessages, locale } from '_/intl'
import configureStore from '_/store'
import Selectors from '_/selectors'
import AppConfiguration, { readConfiguration } from '_/config'
import { login } from '_/actions'

import App from './App'
import GlobalErrorBoundary from './GlobalErrorBoundary'

// Patternfly dependencies
// jQuery needs to be globally available (webpack.ProvidePlugin can be also used for this)
window.$ = window.jQuery = require('jquery')
require('bootstrap/dist/js/bootstrap')
window.patternfly = {}
window.patternfly = require('patternfly/dist/js/patternfly')
window.selectpicker = require('bootstrap-select/js/bootstrap-select.js')
window.combobox = require('patternfly-bootstrap-combobox/js/bootstrap-combobox.js')

function renderApp (store: Object, errorBridge: Object) {
  ReactDOM.render(
    <GlobalErrorBoundary errorBridge={errorBridge}>
      <Provider store={store}>
        <IntlProvider locale={locale} messages={getSelectedMessages()}>
          <App history={store.history} />
        </IntlProvider>
      </Provider>
    </GlobalErrorBoundary>,

    (document.getElementById('root'): any)
  )
}

/**
 * oVirt SSO is required
 *
 * SsoPostLoginFilter (aaa.jar, ovirt-engine) must be configured to provide logged-user details to session.
 * HTML entry point (the index.jsp) stored session data into JavaScript's 'window' object.
 *
 * See web.xml.
 */
function fetchToken (): { token: string, username: string, domain: string, userId: string } {
  const userInfo = window.userInfo
  console.log(`SSO userInfo: ${JSON.stringify(userInfo)}`)

  if (userInfo) {
    return {
      token: userInfo.ssoToken,
      username: userInfo.userName,
      domain: userInfo.domain,
      userId: userInfo.userId,
    }
  }
  return {
    token: '',
    username: '',
    domain: '',
    userId: '',
  }
}

function addBrandedResources () {
  addLinkElement('shortcut icon', branding.resourcesUrls.favicon)
  addLinkElement('stylesheet', branding.resourcesUrls.brandStylesheet)
  addLinkElement('stylesheet', branding.resourcesUrls.baseStylesheet)
}

function addLinkElement (rel: string, href: string) {
  const linkElement = window.document.createElement('link')
  linkElement.rel = rel
  linkElement.href = href
  window.document.head.appendChild(linkElement)
}

function SagaErrorBridge (storeRootTask: Task) {
  let handler = null

  this.setErrorHandler = (errorHandler) => {
    handler = errorHandler
  }

  this.throw = (err) => {
    if (handler !== null) {
      handler(err)
    }
  }

  storeRootTask.done.catch(err => this.throw(err))
}

function onResourcesLoaded () {
  console.log(`Current configuration: ${JSON.stringify(AppConfiguration)}`)

  addBrandedResources()

  const store = configureStore()
  Selectors.init({ store })

  // do initial render
  renderApp(store, new SagaErrorBridge(store.rootTask))

  // and start the login/init-data-load action
  const { token, username, domain, userId }: { token: string, username: string, domain: string, userId: string } = fetchToken()
  if (token) {
    store.dispatch(login({ username, token, userId, domain }))
  } else {
    console.error('Missing SSO Token!')
  }
}

function start () {
  readConfiguration()
    .then(branding.loadOnce)
    .then(onResourcesLoaded)
}

start()
