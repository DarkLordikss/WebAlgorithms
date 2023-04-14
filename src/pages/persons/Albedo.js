import React from 'react';
import albedo_sprite from './sprites/albedo_sprite.png';
import dialog from "./sprites/dialog_left.png"

import './persons.css'

const Albedo = () => {
    return (
        <div id="Poland" className="person albedo-container">
            <img className="albedo-dialog" src={dialog} alt="dialog" />
            <code className="code-dialog-alb">Предпочитаете<br />лабиринт?</code>
            <img id="Poland" src={albedo_sprite} alt="Albedo"/>
        </div>
    )
}

export default Albedo;