import React from 'react'
import './AbcEditor.css'

import AdminBar from './AdminBar'

import abcjs from 'abcjs'

class AbcEditor extends React.Component{

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

    render() {
        return (

            <div className="AbcEditor">
                <div className="editor-controls">
                    <button onClick={this.props.controls.save}>save</button>
                    <button onClick={this.props.controls.cancel}>cancel</button>
                </div>
                <textarea id="abc"
                    value={this.props.abc}
                    onChange={this.props.controls.handleAbcChange}/>
                <div id="display">
                    <div id="warnings"></div>
                    <div id="sheet"></div>
                </div>
            </div>
        )
    }
}

export default AbcEditor
