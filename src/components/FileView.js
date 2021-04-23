import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {FileInfoSubHeader} from './Header'
import {parseFileName, parseModifiedTime} from '../Utilities'

import {API_KEY} from '../env'

const API_URL = "https://www.googleapis.com/drive/v3/files/"
const API_QUERY = "key=" + API_KEY
const FIELDS = "?fields=name,modifiedTime,properties,id"

const tags = ["Guideline", "tag #2", "tag #3", "tag #4", "test"]

function FileView (props) {
    const [fileInfo, setfileInfo] = useState({})

    let {fileID} = useParams()
    let pdfURL = "https://drive.google.com/file/d/" + fileID + "/preview"
    let printURL = "https://drive.google.com/uc?id=" + fileID + "&export=print"

    const getFileInfo = async() => {
        const result = await fetch(API_URL + fileID + FIELDS + "&" + API_QUERY)
        const jsonData = await result.json()

        console.log(jsonData)

        setfileInfo(jsonData)
    }

    useEffect( () => {
        (async () => {
            getFileInfo()
        })()
    }, [])

    let name = '...'
    let modifiedTime = '...'
    if (fileInfo.name && fileInfo.modifiedTime) {
        name = parseFileName(fileInfo.name)
        modifiedTime = parseModifiedTime(fileInfo.modifiedTime)
    }

    return (
        <div className="main-view">
            <FileInfoSubHeader name={name} modifiedTime={modifiedTime} printURL={printURL} tags={tags} />
             <iframe className="pdf-frame" src={pdfURL}></iframe>
        </div>
    )
}

export default FileView