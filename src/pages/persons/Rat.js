import React from 'react';
import rat_sprite from './sprites/rat_sprite.png';
import dialog from "./sprites/dialog_right.png"

import './persons.css'

const Rat = () => {
    return (
        <div id="Rat" className="person rat-container">
            <code className="code-dialog-rat">Желаете<br />развиваться?</code>
            <img className="rat-dialog" src={dialog} alt="dialog" />
            <img id="Albedo" src={rat_sprite} alt="Rat"/>
        </div>
    )
}

export default Rat;