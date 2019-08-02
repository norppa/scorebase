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
        console.log("Your screen resolution is: " + document.documentElement.clientWidth + "x" + document.documentElement.clientHeight)
        return (
            <div className="AbcViewer">
                <div id="sheet"></div>
            </div>
        )
    }
}

export default AbcViewer
