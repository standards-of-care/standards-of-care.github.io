import React from "react"
import {useParams} from "react-router-dom"
import {FileInfoSubHeader} from './Header'

function FileView (props) {
    let {fileID} = useParams()
    let name = "Antenatal Testing Guidelines.pdf"
    let modifiedTime = "2021-03-24"
    let pdfURL = "https://drive.google.com/file/d/" + fileID + "/preview"
    let printURL = "https://drive.google.com/uc?id=" + fileID + "&export=print"

    return (
        <div className="main-view">
            <FileInfoSubHeader name={name} modifiedTime={modifiedTime} printURL={printURL} />
             <iframe className="pdf-frame" src={pdfURL}></iframe>
        </div>
    )
}

export default FileView