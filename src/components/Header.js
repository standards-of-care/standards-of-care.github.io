import React, {useState} from "react"
import {Link} from "react-router-dom"
import {parseFileName} from '../Utilities'
import {FileTag} from "./FileTag"
import HeaderLogo from '../slu-logomark.png'
import { FiSearch, FiPrinter, FiLogIn, FiPlusCircle, FiEdit } from "react-icons/fi"

function Header (props) {
    return (
        <div className="header-wrapper">
            <div className="header">
                <div className="header-home-wrapper">
                    <Link to="/" className="home-link">
                        <img src={HeaderLogo} className="header-logo" />
                        <p>Standards of Care</p>
                    </Link>
                        <i className="header-text">&nbsp;Maternal-Fetal Medicine</i>
                </div>

                <MenuButton />
            </div>
        </div>
    )
}

function MenuButton (props) {
    return (
        <span title="Admin Log In">
            <Link to="/manage" id="menu-button">
                <FiLogIn strokeWidth="1.5" />
            </Link>
        </span>
    )
}

function SearchSubHeader (props) {
    const [formValue, setFormValue] = useState("")

    const handleSearch = (event) => {
        event.preventDefault()
        props.updateFunction(formValue)
    }

    const updateSearch = (event) => {
        event.preventDefault()
        setFormValue(event.target.value)
    }

    return (
        <div className="subheader">
            <form id="search-bar" onSubmit={handleSearch}>
                <input type="search" onChange={updateSearch}/>
                <button type="button" onClick={handleSearch}>
                    <FiSearch className="button-icon" />
                </button>
            </form>
        </div>
    )
}

function FileInfoSubHeader (props) {
    let tagsList = props.tags.map(tagName => <FileTag tagName={tagName} key={tagName} />)
    let editLink
    if (props.isAuth) {
        editLink = <Link to={`/${props.fileID}/edit`} className="edit-link"><FiEdit />Edit File</Link>
    }
    return (
        <div className={"subheader"}>
            <div className="subheader-wrapper">

                <div className="file-name">
                    <span>{parseFileName(props.name)} {editLink}</span>
                    <a href={props.printURL} target="_blank" rel="noopener noreferrer" className="print-link">
                        <FiPrinter className="button-icon" /> 
                        Print
                    </a>
                </div>

                <div className="file-date">Last Modified: {props.modifiedTime}</div>

                <div id="tags-list">
                    {tagsList}
                </div>

            </div>
        </div>
    )
}

export {Header, SearchSubHeader, FileInfoSubHeader}