import React from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import SplitPane from 'react-split-pane'
import 'react-toastify/dist/ReactToastify.min.css'

import constants from './constants'
import Navigation from './Navigation'
import AbcViewer from './AbcViewer'
import AbcEditor from './AbcEditor'
import './App.css'
import './index.css'

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
        abc: '',
        abcChanged: false,
        transpose: 0
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
            .then(response => this.setState({ tunes: response.data }))
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
                    this.setState((({id, abc}) => ({id, abc, abcChanged: false})) (response.data))
                })
        },
        edit: () => {
            this.setState({ editMode: true })
        },
        exitEditMode: () => {
            this.setState({ editMode: false })
            this.controls.select(this.state.id)()
        },
        save: () => {
            axios.post(api, {id: this.state.id, abc: this.state.abc})
                .then(response => {
                  toast.success('Save successful')
                  const newState = { abcChanged: false }
                  if (this.state.id === 'new') {
                      newState.id = response.data.insertId
                  }
                  this.setState(newState)
                })
                .catch(error => console.error(error))
        },
        delete: () => {
            axios.delete(api + '/' + this.state.id)
                .then(response => {
                    toast.success('Delete successful')
                    axios.get(api)
                        .then(response => this.setState({ tunes: response.data, editMode: false, id: undefined }))
                        .catch(error => console.error(error))
                })
        },
        create: () => {
          this.setState({ editMode: true, id: 'new', abc: skeletonAbc })
        },
        transpose: (semitones) => this.setState({transpose: this.state.transpose + semitones}),
        handleAbcChange: (abc) => this.setState({ abc, abcChanged: true }),
        isAbcChanged: () => this.state.abcChanged,
        getSelected: () => this.state.id,
        selectRandom: () => {
            const randomIndex = Math.floor(Math.random() * this.state.tunes.length)
                console.log('ranbdom', randomIndex)
            this.controls.select(this.state.tunes[randomIndex].id)()
        },
    }

    render() {
        if (this.state.editMode) {
            return (
                    <AbcEditor abc={this.state.abc}
                        controls={this.controls} />
            )
        } else {
            return (
                <div className="App">
                    <SplitPane
                        split="vertical"
                        defaultSize={200}>
                            <Navigation tunes={this.state.tunes}
                                id={this.state.id}
                                controls={this.controls}
                                editMode={this.state.editMode}
                                auth={this.state.auth} />
                            { this.state.id
                            ? <AbcViewer abc={this.state.abc}
                                transpose={this.state.transpose}/>
                            : <h1>{constants.siteHeader}</h1> }
                    </SplitPane>
                </div>
            )
        }
    }
}

export default App
