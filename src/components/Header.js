import React from "react"
import {Link} from "react-router-dom"
import {parseFileName} from '../Utilities'
import HeaderLogo from '../slu-logomark.png'

function Header (props) {
    return (
        <div className="header">
            <Link to="/" className="home-link">
                <img src={HeaderLogo} className="header-logo" />
                <p>Standards of Care</p>
            </Link>
                <i className="header-text">&nbsp;Maternal-Fetal Medicine</i>
        </div>
    )
}

function SearchSubHeader (props) {
    return (
        <div className="subheader">
            <form id="search-bar">
                <input type="search"></input>
                <button type="button">🔍&#xFE0E;</button>
            </form>
        </div>
    )
}

function FileInfoSubHeader (props) {
    return (
        <div className={"subheader"}>
            <p className="file-name">
                <span>{parseFileName(props.name)}</span>
                <a href={props.printURL} target="_blank" rel="noopener noreferrer" className="print-link">Print</a>
            </p>
            <p className="file-date">Last Modified: {props.modifiedTime}</p>
        </div>
    )
}

export {Header, SearchSubHeader, FileInfoSubHeader}