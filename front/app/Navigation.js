import React from 'react'
import axios from 'axios'
import { FaBars } from 'react-icons/fa'

import './Navigation.css'

class Navigation extends React.Component {
    state = {
        search: '',
        password: '',
        menuOpen: false,
        loginDialogOpen: false,
    }
    passwordInput = React.createRef();

    handleSearchInput = (event) => this.setState({ search: event.target.value })
    handlePasswordInput = (event) => this.setState({ password: event.target.value })

    handleMenuIconClick = () => this.setState(prevState => ({menuOpen: !prevState.menuOpen}))
    openLoginDialog = () => this.setState({ loginDialogOpen: true }, () => this.passwordInput.current.focus())
    closeLoginDialog = () => this.setState({ loginDialogOpen: false, menuOpen: false, password: '' })

    submitPassword = (event) => {
        event.preventDefault()
        this.props.controls.login(this.state.password)
        this.setState({ password: '', login: false })
    }

    pressDelete = () => {
        const tunename = this.props.tunes.find(x => x.id === this.props.controls.getSelected()).name
        if (confirm(`Are you sure you want to delete "${tunename}"`)) {
            this.setState({menuOpen: false})
            this.props.controls.delete()
        }
    }



    AdminMenu = () => (
        <div className="navi-menu">
            <ul>

                { this.props.controls.getSelected()
                    ? [
                        <li key="navigation-edit" onClick={this.props.controls.edit}> edit </li>,
                        <li key="navigation-delete" onClick={this.pressDelete}> delete </li>
                    ]
                    : <li onClick={this.props.controls.create}> new </li>
                }
                <li onClick={this.props.controls.logout}> log out </li>
            </ul>
        </div>
    )

    UserMenu = () => (
        <div className="navi-menu">
            {this.state.loginDialogOpen
            ? <form onSubmit={this.submitPassword}>
                <input type="password"
                    ref={this.passwordInput}
                    value={this.state.password}
                    onChange={this.handlePasswordInput}
                    onBlur={this.closeLoginDialog}
                    />
            </form>
            : <ul>
                <li onClick={this.openLoginDialog}>log in</li>
            </ul> }

        </div>
    )

    Menu = () => { return this.props.auth ? <this.AdminMenu /> : <this.UserMenu /> }

    render () {
        const selectedId = this.props.controls.getSelected()
        return (
            <div className="Navigation">
                <div className="navi-row">
                    <input type="text" value={this.state.search} onChange={this.handleSearchInput} />
                    <FaBars id="navi-menu-icon" onClick={this.handleMenuIconClick}/>
                </div>

                { this.state.menuOpen ? <this.Menu /> : null }

                <ul>
                    {
                        this.props.tunes
                            .filter(tune => tune.name.toLowerCase().includes(this.state.search.toLowerCase()))
                            .sort((a,b) => a.name < b.name ? -1 : 1)
                            .map(song => (
                                <li key={song.id}
                                    className={song.id === selectedId ? 'selected' : ''}
                                    onClick={this.props.controls.select(song.id)}>
                                        {song.name ? song.name : '<no name>'}
                                </li>))
                    }
                </ul>
            </div>
        )
    }
}

export default Navigation;
