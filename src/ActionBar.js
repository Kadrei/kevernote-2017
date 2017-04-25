import React from 'react';

export default (props) => {
    return (
        <nav className="action-bar">
            <div className="action-bar__logo"></div>
            <button className="action-bar__new" onClick={props.onAdd}>+</button>
        </nav>
    )
}