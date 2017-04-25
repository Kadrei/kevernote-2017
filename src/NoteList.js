import React from 'react'
import NotePreview from './NotePreview'

export default class NoteList extends React.Component {

    constructor(props) {
        super(props)
        this.tick = this.tick.bind(this)
    }

    componentDidMount() {
        this.timer = setInterval(this.tick, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    tick() {
        
    }

    render() {
        const {
            notes, onSelect, selectedNoteId
        } = this.props
        const notesComponents = [...notes]
            .sort((note1, note2) => note2.id - note1.id)
            .map(note => <NotePreview
                note={note}
                key={note.id}
                onClick={onSelect}
                selected={note.id === selectedNoteId} />)

        return (<aside className="note-list">
            <h2 className="note-list__title">Notes</h2>
            <div className="note-list__summary">{notes.length} notes</div>
            <ul className="note-list__container">
                {notesComponents}
            </ul>
        </aside>)
    }
}