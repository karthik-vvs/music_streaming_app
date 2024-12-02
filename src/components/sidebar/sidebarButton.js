import React from 'react';
import './sidebar.css';
import {Link, useLocation} from "react-router-dom"
import "./sidebarButton.css"

const SidebarButton = (props) => {
    const location = useLocation();
    const isActive = location.pathname === props.to;

    const btnClass = isActive ? "btn-body active" : "btn-body";
  return (
    <Link to={props.to}>
        <div className={btnClass}>
            {props.icon}
            <p className='btn-title'>{props.title}</p>
        </div>
        </Link>
  )
}

export default SidebarButton