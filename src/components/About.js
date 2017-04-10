import React from 'react'
import Product from '../version'
import logo from '../ovirt_top_right_logo.png'

const AboutDialog = () => {
  // TODO: link documentation: https://github.com/oVirt/ovirt-web-ui/issues/134
  // TODO: oVirt API version

  return (
    <div className='modal fade' id='about-modal' tabIndex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>
      <div className='modal-dialog'>
        <div className='modal-content about-modal-pf'>
          <div className='modal-header'>
            <button type='button' className='close' data-dismiss='modal' aria-hidden='true'>
              <span className='pficon pficon-close' />
            </button>
          </div>
          <div className='modal-body'>
            <h1>oVirt VM Portal</h1>

            <div className='product-versions-pf'>
              <ul className='list-unstyled'>
                <li>Version <strong>{Product.version}-{Product.release}</strong></li>
                <li>Please report issues on <strong><a href='https://github.com/oVirt/ovirt-web-ui/issues' target='_blank'>GitHub Issue Tracker</a></strong></li>
              </ul>
            </div>

            <div className='trademark-pf'>
              Relesed under <a href='https://github.com/oVirt/ovirt-web-ui/blob/master/LICENSE' target='_blank'>Apache License 2.0</a>
            </div>

          </div>
          <div className='modal-footer'>
            <img src={logo} alt='oVirt logo' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutDialog
