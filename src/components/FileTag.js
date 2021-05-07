import { useEffect, useState } from "react"
import { FiX, FiPlusCircle } from "react-icons/fi"
import Autosuggest from 'react-autosuggest';

function FileTag(props) {
    var removeButton
    if (props.isAuth) {
        removeButton = (
            <span title="remove tag" >
                <FiX className="remove-tag-button" onClick={() => props.removeTag(props.tagName)} />
            </span>
        )
    }

    return (
        <div className="tag">
            {props.tagName}
            {removeButton}
        </div>
    )
}

function AddTag(props) {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState("")
    const [suggestions, setSuggestions] = useState([])

    const updateInput = (event) => {
        event.preventDefault()
        setValue(event.target.value)
    }

    const handleAdd = (event, v) => {
        event.preventDefault()
        props.addTag(v)
        setValue("")
        setSuggestions([])
    }

    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase()
        const inputLength = inputValue.length
        
        return inputLength === 0 ? [] : props.globalTags.filter(lang =>
            lang.toLowerCase().slice(0, inputLength) === inputValue
        )
    } 

    const getSuggestionValue = (suggestion) => suggestion

    const renderSuggestion = (suggestion) => (
        <span>
            {suggestion}
        </span>
    )

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value))
    }

    const onSuggestionsClearRequested = () => {
        setSuggestions([])
    }

    const onSuggestionSelected = (e, {suggestion}) => {
        handleAdd(e, suggestion)
    }

    useEffect( () => {
        if (!isEditing) {
            setValue("")
            setSuggestions([])
        }
    }, [isEditing])

    let content
    if (isEditing) {
        const inputProps = {
            onChange: updateInput,
            value,
            autoFocus: true,
            onBlur: () => setIsEditing(false)
        }

        let hasSuggestions = ""
        if (suggestions.length > 0) {
            hasSuggestions = " input-has-suggestions"
        }

        content = (
            <div className={"tag tag-input" + hasSuggestions}>
                <form onSubmit={(e) => handleAdd(e, value)}>
                    {/* <input type="text" autoFocus onChange={updateInput} onBlur={() => setIsEditing(false)} /> */}
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                        onSuggestionSelected={onSuggestionSelected}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                    />
                </form>
            </div>
        )
    } else {
        content = <FiPlusCircle className={"tag add-tag-button"} onClick={() => setIsEditing(true)} />
    }

    return (
        <span title="add tag">
            {content}
        </span>
    )
}

export {FileTag, AddTag}