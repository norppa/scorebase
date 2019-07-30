import React from 'react'
import './AbcEditor.css'

import AdminBar from './AdminBar'

import abcjs from 'abcjs'

class AbcEditor extends React.Component{
    state = { showAddBlockLyrics: false, blockLyrics: '' }

    componentDidMount() {
        this.refreshEditor()
    }

    componentDidUpdate() {
        this.refreshEditor()
    }

    refreshEditor = () => {
        new abcjs.Editor('abc', {
            canvas_id: 'sheet',
            warnings_id: 'warnings',
            abcjsParams: {
                staffwidth: 850
            }
        })
    }

    handleAbcChange = (event) => this.props.controls.handleAbcChange(event.target.value)

    handleLyricsChange = (event) => this.setState({ blockLyrics: event.target.value })
    showAddBlockLyrics = () => this.setState({showAddBlockLyrics: !this.state.showAddBlockLyrics})
    addBlockLyricsToAbc = () => {
        const abc = this.props.abc.replace(/W:.*/g, '').trim() + '\n' + this.state.blockLyrics.replace(/^/g, 'W:')
        this.props.controls.handleAbcChange(abc)
        this.setState({showAddBlockLyrics: false, blockLyrics: ''})
    }

    render() {
        return (

            <div className="AbcEditor">
                <div className="editor-controls">
                    <button onClick={this.props.controls.save}>save</button>
                    <button onClick={this.props.controls.cancel}>cancel</button>
                    <button onClick={this.showAddBlockLyrics}>add lyrics</button>
                </div>
                <div id="input">
                    <textarea id="abc"
                        value={this.props.abc}
                        onChange={this.handleAbcChange}/>
                    <div id="add-lyrics-div"
                        className={this.state.showAddBlockLyrics ? '' : 'hidden'}>
                        <button id="add-lyrics-btn"
                            onClick={this.addBlockLyricsToAbc}>REPLACE LYRICS</button>
                        <textarea
                            value={this.state.lyrics}
                            onChange={this.handleLyricsChange} />
                    </div>
                </div>
                <div id="output">
                    <div id="warnings"></div>
                    <div id="sheet"></div>
                </div>
            </div>
        )
    }
}

export default AbcEditor
