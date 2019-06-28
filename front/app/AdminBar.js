import React from 'react'

class AdminBar extends React.Component {


    render () {
        const { edit, save, cancel } = this.props.controls
        return (
            <div className="AdminBar">
                {this.props.activeId
                    ? <button onClick={editSong}>edit</button>
                    : null }

                {this.props.editMode
                    ? [
                        <button key="adminbar-cancel" onClick={cancelEdit}>cancel</button>,
                        <button key="adminbar-save" onClick={saveSong}>save</button>
                    ]
                    : this.props.activeId ? <button onClick={window.print}>print</button> : null }
                <button onClick={this.props.newSong}>new</button>
            </div>
        )
    }
}

export default AdminBar;
