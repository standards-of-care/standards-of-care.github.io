import React, {useEffect, useState} from "react"
import { FiTrash2, FiEdit3 } from "react-icons/fi"

function SubmitButton(props) {
    const inactive = (
        {
            true: " active",
            false: " inactive"
        }
    )

    const title = ( !props.isNewFile ? 
        {
            true: "Submit Changes",
            false: "No Changes to Submit"
        } : {
            true: "Upload File",
            false: "Must Select File and Enter Name"
        }
    )

    const text = !props.isNewFile ? "SUBMIT CHANGES" : "UPLOAD FILE"

    const handleClick = () => {
        if (props.canSubmit) {
            props.submitChanges()
        }
    }

    return (
        <span title={title[props.canSubmit]} className={"submit-button"+inactive[props.canSubmit]} onClick={handleClick}>
            {text}
        </span>
    )
}

function DeleteButton(props) {
    const handleClick = (event) => {
        if (window.confirm(`Are you sure you want to delete ${props.fileName}?`)) {
            props.deleteFile()
        }
    }
    return (
        <span title={"Delete File"} className="delete-button" onClick={handleClick} >
            <FiTrash2 />
            {"DELETE FILE"}
        </span>
    )
}

function FilePicker(props) {
    const [isSelected, setIsSelected] = useState(false)
    const resetFile = (e) => {
        e.preventDefault()
        document.getElementById("file-picker").value = ""
        props.resetFile()
        setIsSelected(false)
    }

    var removeButton = (isSelected) ? <button type="button" onClick={resetFile} >Remove File</button> : null

    const handleOnChange = (event) => {
        props.addFile(event)
        setIsSelected(true)
    }

    return (
        <form onChange={handleOnChange} className="file-upload-picker">
            <input id="file-picker" type="file" accept=".pdf" />
            {removeButton}
        </form>
    )
}

function EditName(props) {
    const [formValue, setFormValue] = useState("")
    const [isEditing, setIsEditing] = useState(false)

    let displayValue, isEmptyClass
    if (props.name === "") {
        displayValue = "Enter File Name"
        isEmptyClass = " empty"
    } else {
        displayValue = props.name
        isEmptyClass = ""
    }


    const handleOnChange = (event) => {
        event.preventDefault()
        setFormValue(event.target.value)
    }

    const handleOnSubmit = (event) => {
        event.preventDefault()
        if (formValue !== "") {
            let fileName = formValue.replace('.pdf', '') + '.pdf'
            props.editName(fileName)
        }
        setIsEditing(false)
        setFormValue("")
        console.log(formValue)
    }

    let content
    if (isEditing) {
        content = (
            <form className={`editing`} onBlur={() => setIsEditing(false)} onSubmit={handleOnSubmit}>
                <input autoFocus defaultValue={props.name} onFocus={handleOnChange} onChange={handleOnChange} />
            </form>
        )
    } else {
        content = (
            <div className={`waiting${isEmptyClass}`} onClick={() => setIsEditing(true)}>
                {displayValue}
                <FiEdit3 />
            </div>
        )
    }

    return (
        <span title="Edit File Name" className="edit-name">
            {content}
        </span>
    )
}

export {SubmitButton, DeleteButton, EditName, FilePicker}