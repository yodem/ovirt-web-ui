import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import AppConfiguration from '_/config'
import { msg } from '_/intl'

import style from './style.css'

export function hasUserHostConsoleAccess ({ vm, config, hosts }) {
  return config.get('administrator') && vm.get('hostId') && hosts.get(vm.get('hostId'))
}

export const CockpitAHREF = ({ host, text }) => {
  const hostName = host.get('name')
  text = text || hostName
  return (
    <a
      href={`https://${host.get('address')}:${AppConfiguration.cockpitPort}/machines`}
      target='_blank'
      id={`cockpitlink-${hostName}`}>
      {text}
    </a>
  )
}
CockpitAHREF.propTypes = {
  host: PropTypes.object.isRequired,
  text: PropTypes.string,
}

const HostConsole = ({ vm, hosts, config }) => {
  if (!hasUserHostConsoleAccess({ vm, hosts, config })) {
    return null
  }

  const host = hosts.get(vm.get('hostId'))

  // TODO: change to Cockpit SSO link once ready
  return (
    <span className={style['container']}>
      <CockpitAHREF host={host} text={msg.hostConsole()} />
    </span>
  )
}
HostConsole.propTypes = {
  vm: PropTypes.object.isRequired,
  hosts: PropTypes.object.isRequired, // deep immutable, {[id: string]: Host}
  config: PropTypes.object.isRequired,
}

export default connect(
  (state) => ({
    hosts: state.hosts,
    config: state.config,
  })
)(HostConsole)
