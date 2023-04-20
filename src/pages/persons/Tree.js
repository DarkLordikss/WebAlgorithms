import React from 'react';
import tree_sprite from './sprites/tree_sprite.jpg';
import dialog from "./sprites/dialog_left.png"

import './persons.css'

const Tree = () => {
    return (
        <div id="Tree" className="person tree-container">
            <img className="tree-dialog" src={dialog} alt="dialog" />
            <code className="code-dialog-tree">)</code>
            <img id="Tree" src={tree_sprite} alt="Tree"/>
        </div>
    )
}

export default Tree;