import react from "react"
import {NewFile} from './FileResult'

function FileList (props) {
    let newFile = props.isAuth ? <NewFile /> : null
    let noResults = (!(props.files.length > 0) && !props.isBeforeLoad) ? <div>No results.</div> : null

    return (
        <div className="drive-file-list">
            {newFile}
            {props.files}
            {noResults}
            <div>&nbsp;{/*this is to add padding to the bottom of the scroll column*/}</div>
        </div>
    )
}

export default FileList