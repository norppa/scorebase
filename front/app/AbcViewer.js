import React from 'react'
import abcjs from 'abcjs'

class AbcViewer extends React.Component {

    componentDidMount() {
        this.componentDidUpdate()
    }

    componentDidUpdate() {
        abcjs.renderAbc('sheet', this.props.abc, {
            staffwidth: 1000,
            visualTranspose: this.props.transpose
        })
    }

    render() {
        return (
            <div className="AbcViewer">
                <div id="sheet"></div>
            </div>
        )
    }
}

export default AbcViewer
