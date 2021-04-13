import react from "react"

function FileList (props) {
    return (
        <div className="drive-file-list">
            {props.files}
            <div>&nbsp;{/*this is to add padding to the bottom of the scroll column*/}</div>
        </div>
    )
}

export default FileList