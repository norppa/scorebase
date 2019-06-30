import React from 'react'
import constants from './constants'

class Header extends React.Component {
    render () {
        return (
                <div className="Header">
                    <h1>{constants.siteHeader}</h1>
                </div>
        )
    }
}

export default Header;
