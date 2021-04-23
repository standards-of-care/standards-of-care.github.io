import React, {useState} from "react"
import {Link} from "react-router-dom"
import {parseFileName} from '../Utilities'
import HeaderLogo from '../slu-logomark.png'
import { FiSearch, FiPrinter, FiMenu } from "react-icons/fi"

function Header (props) {
    return (
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
    )
}

function MenuButton (props) {
    return (
        <button type="button" id="menu-button">
            <FiMenu />
        </button>
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
    let tagsList = props.tags.map(txt => <div className="tag">{txt}</div>)

    return (
        <div className={"subheader"}>
            <div className="subheader-wrapper">

                <div className="file-name">
                    <span>{parseFileName(props.name)}</span>
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