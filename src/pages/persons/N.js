import React from 'react';
import n_sprite from './sprites/n_sprite.png';
import dialog from "./sprites/dialog_left.png"

import './persons.css'

const N = () => {
    return (
        <div id="N" className="person n-container">
            <img className="n-dialog" src={dialog} alt="dialog" />
            <code className="code-dialog-n">Опять цифры?!</code>
            <img id="N" src={n_sprite} alt="N"/>
        </div>
    )
}

export default N;