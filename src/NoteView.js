import React from 'react'

export default (props) => {
    const {
        note,
        onDelete,
        onModify
    } = props

    if (!note) {
        return <article className="note-view"></article>
    }

    return (
        <article className="note-view">
            <nav className="note-view__actions">
                <button className="note-view__actions__trash" onClick={() => onDelete(note.id)}></button>
                <span className="note-view__actions__status">{note.status || 'Saved.'}</span>
            </nav>
            <input className="note-view__title" value={note.title} onChange={ev => onModify(note.id, { title: ev.target.value, status: 'Editing...' })} />
            <textarea className="note-view__body" value={note.body} onChange={ev => onModify(note.id, { body: ev.target.value, status: 'Editing...' })} />
        </article>
    )
}