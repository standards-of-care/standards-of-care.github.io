import react from "react"
import {NewFile} from './FileResult'

function FileList (props) {
    let newFile
    if (props.isAuth) {
        newFile = (
            <NewFile />
        )
    }
    return (
        <div className="drive-file-list">
            {newFile}
            {props.files}
            <div>&nbsp;{/*this is to add padding to the bottom of the scroll column*/}</div>
        </div>
    )
}

export default FileList