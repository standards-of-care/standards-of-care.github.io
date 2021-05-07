import React, {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {FileInfoSubHeader} from './Header'
import {parseFileName, parseModifiedTime, parseTags, getAccessToken} from '../Utilities'

import {API_KEY, DRIVE_ID} from '../env'

const API_URL = "https://www.googleapis.com/drive/v3/files/"
const API_QUERY = "key=" + API_KEY
const FIELDS = "?fields=name,modifiedTime,properties,id"

function FileView (props) {
    const [fileInfo, setFileInfo] = useState({})
    const [isAuth, setIsAuth] = useState(true)
    const [oauthToken, setOauthToken] = useState("")

    let {fileID} = useParams()
    let pdfURL = "https://drive.google.com/file/d/" + fileID + "/preview"
    let printURL = "https://drive.google.com/uc?id=" + fileID + "&export=print"

    const getFileInfo = async() => {
        const corporaParams = `includeItemsFromAllDrives=true&corpora=drive&supportsAllDrives=true`
        const driveParam = `driveId=${DRIVE_ID}`
        
        // let url = API_URL + fileID + FIELDS
        let url = `${API_URL}${fileID}${FIELDS}&${driveParam}&${corporaParams}`

        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + oauthToken
            }
        })
        const jsonData = await result.json()

        console.log(jsonData)

        setFileInfo(jsonData)
    }

    useEffect( () => {
        (async () => {
            const oauth = await getAccessToken()
            setOauthToken(oauth.access_token)
        })()
    }, [])

    useEffect( () => {
        if (oauthToken != "") {
            setIsAuth(true)
            getFileInfo()
        } else {
            setIsAuth(false)
        }
    }, [oauthToken])

    let name = '...'
    let modifiedTime = '...'
    if (fileInfo.name && fileInfo.modifiedTime) {
        name = parseFileName(fileInfo.name)
        modifiedTime = parseModifiedTime(fileInfo.modifiedTime)
    }

    let tags = []
    if ("properties" in fileInfo) {
        if ("tags" in fileInfo.properties) {
            tags = parseTags(fileInfo.properties.tags)
        }
    }

    return (
        <div className="main-view">
            <FileInfoSubHeader name={name} modifiedTime={modifiedTime} fileID={fileInfo.id} printURL={printURL} tags={tags} isAuth={isAuth} />
             <iframe className="pdf-frame" src={pdfURL}></iframe>
        </div>
    )
}

export default FileView