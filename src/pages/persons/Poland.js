import React from 'react';
import poland_sprite from './sprites/poland_sprite.png';
import dialog from "./sprites/dialog_right.png"

import './persons.css'

const Poland = () => {
    return (
        <div id="Poland" className="person poland-container">
            <code className="code-dialog-poland">Раздел...</code>
            <img className="poland-dialog" src={dialog} alt="dialog" />
            <img id="Albedo" src={poland_sprite} alt="Rat"/>
        </div>
    )
}

export default Poland;