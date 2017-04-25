import React from 'react'

export default (props) => {
    const { selected, note, onClick } = props
    const {
        createdAt,
        title,
        body,
        id
    } = note

    const createdAtText = new Date(createdAt).toString()
    const formattedBody = body.length > 100 ? `${body.substr(0, 97)}...` : body

    return (
        <li className={"note-preview " + (selected ? 'is-selected' : '')}>
            <a className="note-preview__link" onClick={(ev) => onClick(id)}>
                <span className="note-preview__time">{createdAtText}</span>
                <h2 className="note-preview__title">{title}</h2>
                <p className="note-preview__body">{formattedBody}</p>
            </a>
        </li>
    )
}