import React from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import constants from './constants'
import Header from './Header'
import Navigation from './Navigation'
import AbcViewer from './AbcViewer'
import AbcEditor from './AbcEditor'
import './App.css'

import abcjs from 'abcjs'

const { api, skeletonAbc } = constants
const localStorageKey = 'admin'
toast.configure()

class App extends React.Component {
    state = {
        auth: undefined,
        editMode: false,
        tunes: [],
        id: undefined,
        abc: ''
    }


    componentDidMount() {
      console.log('env:', process.env.NODE_ENV)
        const token = window.localStorage.getItem(localStorageKey)
        if (token) {
            this.setState({ auth: token })
        }
        this.fetchSongList()
    }

    fetchSongList = () => {
        axios.get(api)
            .then(res => {
                console.log('response', res)
                return res
            })
            .then(response => this.setState({ tunes: response.data }, () => console.log(this.state)))
            .catch(error => console.error(error))
    }

    saveSong = () => {
        axios.post(api, {id: this.state.id, abc: this.state.abc})
        .then(response => console.log(response))
        .catch(error => console.error(error))
    }

    controls = {
        login: (password) => {
            axios.post(api + '/login', { password })
                .then(response => {
                    if (response.status === 200) {
                        window.localStorage.setItem(localStorageKey, response.data.token)
                        this.setState({auth: response.data.token})
                        toast.success('Login successful')
                    } else {
                        toast('mysterious success: ' + response)
                    }
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        toast.error('Password incorrect')
                    } else {
                        toast.error('ERROR:' + error)
                    }
                })
        },
        logout: () => {
            window.localStorage.removeItem(localStorageKey)
            this.setState({ auth: undefined })
            toast.success('Logged out')
        },
        select: (id) => () => {
            console.log('select', id)
            axios.get(api + '/' + id)
                .then(response => {
                    this.setState((({id, abc}) => ({id, abc})) (response.data))
                })
        },
        edit: () => {
            this.setState({ editMode: true })
        },
        cancel: () => {
            this.setState({ editMode: false })
            this.controls.select(this.state.id)()
        },
        save: () => {
            axios.post(api, {id: this.state.id, abc: this.state.abc})
                .then(response => console.log(response))
                .catch(error => console.error(error))
        },
        create: () => {
          this.setState({ editMode: true, id: 'new', abc: skeletonAbc })
        },
        handleAbcChange: (event) => this.setState({ abc: event.target.value }),
    }

    render() {
        if (this.state.editMode) {
            return (
                    <AbcEditor abc={this.state.abc}
                        controls={this.controls} />
            )
        } else {
            if (this.state.id) { // view selected tune
                return (
                    <div className="App">
                        <Header />
                        <Navigation tunes={this.state.tunes}
                            controls={this.controls}
                            editMode={this.state.editMode}
                            auth={this.state.auth} />
                        <AbcViewer abc={this.state.abc}/>
                    </div>
            )
        } else { // no selected tune, show frontpage
                return (
                    <div className="App">
                        <Header />
                        <Navigation tunes={this.state.tunes}
                            controls={this.controls}
                            editMode={this.state.editMode}
                            auth={this.state.auth} />
                        <div>frontpage</div>
                    </div>
                )
            }
        }


    }
}

export default App
