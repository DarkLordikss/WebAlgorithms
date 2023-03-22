import React from 'react';
import albedo_sprite from './sprites/albedo_sprite.png';
import dialog from "./sprites/dialog.png"

import './persons.css'

const Albedo = () => {
    return (
        <div id="Albedo" className="person albedo-container">
            <img className="albedo-dialog" src={dialog} alt="dialog" />
            <code className="code-dialog">Предпочитаете<br />лабиринт?</code>
            <img id="Albedo" src={albedo_sprite} alt="Albedo"/>
        </div>
    )
}

export default Albedo;