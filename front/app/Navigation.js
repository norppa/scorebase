import React from 'react'
import axios from 'axios'
import { FaBars, FaPlusCircle, FaMinusCircle } from 'react-icons/fa'

import exportToPdf from './exportToPdf'

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
        this.setState({ password: '', loginDialogOpen: false })
    }

    pressDelete = () => {
        const tunename = this.props.tunes.find(x => x.id === this.props.controls.getSelected()).name
        if (confirm(`Are you sure you want to delete "${tunename}"`)) {
            this.setState({menuOpen: false})
            this.props.controls.delete()
        }
    }

    transpose = (semitones) => () => this.props.controls.transpose(semitones)

    Transposer = () => {
        const className = 'Transposer ' + (this.props.controls.getSelected() ? 'enabled' : 'disabled')
        console.log(this.props.controls.getSelected(), className)
        return (
            <div className={className}>
                <FaPlusCircle className="transpose-btn"
                    style={{verticalAlign: 'middle'}}
                    onClick={this.transpose(1)} />
                <FaMinusCircle className="transpose-btn"
                    style={{verticalAlign: 'middle'}}
                    onClick={this.transpose(-1)} />
                <span className="transpose-label">transpose</span>
            </div>
        )
    }

    exportToPdf = () => {
        const name = this.props.tunes.find(x => x.id === this.props.id).name
        exportToPdf(name)
    }

    Login = () => {
        if (this.state.loginDialogOpen) {
            return (
                <form onSubmit={this.submitPassword}>
                    <input type="password"
                        ref={this.passwordInput}
                        value={this.state.password}
                        onChange={this.handlePasswordInput}
                        onBlur={this.closeLoginDialog}
                        />
                </form>
            )
        } else {
            return (
                <span onClick={this.openLoginDialog}>log in</span>
            )
        }
    }

    AdminMenu = () => (
        <div className="navi-menu">
            <ul>
                <li onClick={this.props.controls.create}
                    className="clickable"> new </li>

                { this.props.controls.getSelected()
                    ? [
                        <li key="navigation-edit"
                            onClick={this.props.controls.edit}
                            className="clickable"> edit </li>,
                        <li key="navigation-delete"
                            onClick={this.pressDelete}
                            className="clickable"> delete </li>,
                        <li key="navigation-transpose">{this.Transposer()}</li>,
                        <li key="navigation-export" onClick={this.exportToPdf}> export to pdf </li>
                    ]
                    : null
                }
                <li onClick={this.props.controls.logout}
                    className="clickable"> log out </li>
            </ul>
        </div>
    )

    UserMenu = () => (
        <div className="navi-menu">
            <ul>
                { this.props.controls.getSelected()
                ? [
                    <li key="navigation-transpose">{this.Transposer()}</li>,
                    <li key="navigation-export" onClick={this.exportToPdf}> export to pdf </li>
                ]
                : null
            }
                <li className="clickable">{this.Login()}</li>
            </ul>
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

                <ul className="navi-list">
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
