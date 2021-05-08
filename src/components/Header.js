import React, {useState} from "react"
import {Link, useLocation} from "react-router-dom"
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { FiSearch, FiPrinter, FiLogIn, FiLogOut, FiEdit, FiShare2 } from "react-icons/fi"

import HeaderLogo from '../slu-logomark.png'
import {parseFileName} from '../Utilities'
import {FileTag} from "./FileTag"
import {FILTER_DEFAULT, FILTER_TAGS, FILTER_NAME} from '../filterEnv'
import { CLIENT_ID } from "../env"

function Header (props) {
    const location = useLocation()

    const homeClick = (event) => {
        console.log(location)
        if (location.pathname === "/") {
            window.location.reload()
        }
    }

    const handleLogIn = (response) => {
        let token = response.accessToken
        let email = response.profileObj.email

        props.handleLogIn(token, email)
    }

    const handleLogOut = (response) => {
        props.handleLogOut()
    }

    const handleOauthFailure = (response) => {
        console.log("Oauth Error:")
        console.log(response)
    }

    const logInOutButton = props.isAuth ? <LogOutButton handleLogOut={handleLogOut} handleFailure={handleOauthFailure} /> : <LogInButton handleLogIn={handleLogIn} handleFailure={handleOauthFailure} />

    return (
        <div className="header-wrapper">
            <div className="header">
                <div className="header-home-wrapper">
                    <Link to={"/"} className="home-link" onClick={homeClick}>
                        <img src={HeaderLogo} className="header-logo" />
                        <p>Standards of Care</p>
                    </Link>
                        <i className="header-text">&nbsp;Maternal-Fetal Medicine</i>
                </div>

                {logInOutButton}
                
            </div>
        </div>
    )
}

function LogInButton (props) {
    return (
        // <span title="Admin Log In" id="menu-button" onClick={props.handleClick}>
        //     <FiLogIn strokeWidth="1.5" />
        // </span>

        <GoogleLogin 
            style={{"background-color": "#264e98"}}
            clientId={CLIENT_ID}
            onSuccess={props.handleLogIn}
            onFailure={props.handleFailure}
            render={renderProps => (
                <button className="oauth-button" onClick={renderProps.onClick} disabled={renderProps.disabled}>Admin Login</button>
            )}
            icon={false}
            cookiePolicy={'single_host_origin'}
            scope={"profile email https://www.googleapis.com/auth/drive"}
        />
    )
}

function LogOutButton (props) {
    return (
        // <span title="Admin Log Out" id="menu-button" className="log-out" onClick={props.handleClick} >
        //     <FiLogOut strokeWidth="1.5" />
        // </span>

        <GoogleLogout 
            clientId={CLIENT_ID}
            onLogoutSuccess={props.handleLogOut}
            onFailure={props.handleFailure}
            render={renderProps => (
                <button className="oauth-button log-out" onClick={renderProps.onClick} disabled={renderProps.disabled}>Log Out</button>
            )}
            icon={false}
            cookiePolicy={'single_host_origin'}
        />
    )
}

function SearchSubHeader (props) {
    const [formValue, setFormValue] = useState("")
    const [isSelected, setIsSelected] = useState(false)

    const handleSearch = (event) => {
        event.preventDefault()
        props.updateFunction(formValue)
    }

    const updateSearch = (event) => {
        event.preventDefault()
        setFormValue(event.target.value)
    }

    const updateFilter = (event) => {
        event.preventDefault()
        let newFilter = event.target.value
        setIsSelected(true)
        props.updateFilter(parseInt(event.target.value))
    }

    let isSelectedClass = isSelected ? "" : "not-selected"

    return (
        <div className="subheader">
            <form id="search-bar" onSubmit={handleSearch}>
                <select title="Select Search Filter (Default: ALL)" id="filter-select" className={isSelectedClass} defaultValue={FILTER_DEFAULT} onChange={updateFilter}>
                    <option hidden disabled value={FILTER_DEFAULT}>▾</option>
                    <option disabled value="">Search Filter:</option>
                    <option value={FILTER_DEFAULT}>All</option>
                    <option value={FILTER_NAME}>Title</option>
                    <option value={FILTER_TAGS}>Tags</option>
                </select>
                <input type="search" placeholder="Search Files..." onChange={updateSearch}/>
                <button type="button" onClick={handleSearch}>
                    <FiSearch className="button-icon" />
                </button>
            </form>
        </div>
    )
}

function FileInfoSubHeader (props) {
    let tagsList = props.tags.map(tagName => <FileTag tagName={tagName} key={tagName} />)
    let editLink = props.isAuth ? (<Link to={`/${props.fileID}/edit`} className="edit-link">Edit File<FiEdit /></Link>) : null
    
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)

        window.alert(
            "Link to this file has been copied to the clipboard!" + "\n\n" +
            window.location.href
        )
    }
    
    let copyButton = <FiShare2 title="Click to copy link to clipboard" id="copy-button" onClick={handleCopyLink} />

    return (
        <div className={"subheader"}>
            <div className="subheader-wrapper">

                <div className="file-name">
                    <span>{parseFileName(props.name)} {copyButton}</span>
                    <div>
                        <a href={props.printURL} target="_blank" rel="noopener noreferrer" className="print-link">
                            <FiPrinter className="button-icon" /> 
                            Print
                        </a>

                        {editLink}
                    </div>
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