import React, {Fragment, useEffect, useState} from "react"
import jws from "jws"

import {FOLDER_ID, FIELDS, DRIVE_ID} from '../env'
import {getFileURL, parseModifiedTime, parseFileName, getAccessToken, parseTags} from '../Utilities'
import {FileResult} from './FileResult'
import {SearchSubHeader} from './Header'
import FileList from './FileList'

const FILTER_DEFAULT = 0
const FILTER_NAME = 1
const FILTER_TAGS = 2

function ListView (props) {
    const [fileList, setFileList] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState(FILTER_DEFAULT)
    const [oauthToken, setOauthToken] = useState("")

    const isAuth = true;

    // build the API search query to get a list of all files
    const filterQuery = "q='" + FOLDER_ID + "' in parents"
    const apiURL = "https://www.googleapis.com/drive/v3/files?"
    const corporaParams = `includeItemsFromAllDrives=true&corpora=drive&supportsAllDrives=true`
    const driveParam = `driveId=${DRIVE_ID}`

    // run HTTP request and parse results into JSX elements
    const fetchFileList = async() => {
        setFileList([])

        // let url = apiURL + filterQuery + "&" + FIELDS + "&orderBy=name"
        let url = `${apiURL}${filterQuery}&${FIELDS}&${driveParam}&${corporaParams}&orderBy=name`

        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + oauthToken
            }
        })
        const jsonData = await result.json()

        setFileList(createFileList(jsonData, searchQuery, FILTER_DEFAULT))
    }

    // run fetchFileList() when component loads for the first time
    useEffect(() => {
        (async () => {
            if (oauthToken != "") {
                fetchFileList()
                console.log(oauthToken)
            }
        })()

    }, [searchQuery, oauthToken])

    useEffect(() => {
        (async () => {
            const oauth = await getAccessToken()
            setOauthToken(oauth.access_token)
        })()
    }, [])

    // add list to the DOM
    return (
        <div className="main-view">
            <SearchSubHeader updateFunction={setSearchQuery} />
            <FileList files={fileList} isAuth={isAuth} />
        </div>
    )
}

function createFileList(jsonData, searchQuery, filter) {
    var fileListArray = []
    for (var i = 0; i < jsonData.files.length; i++) {
        const fileName = parseFileName(jsonData.files[i].name)
        const fileID = jsonData.files[i].id
        const thumbnailLink = jsonData.files[i].thumbnailLink
        const modifiedTime = parseModifiedTime(jsonData.files[i].modifiedTime)
        const fileURL = getFileURL(fileID)
        var tagsList = []
        if ("properties" in jsonData.files[i]) {
            if ("tags" in jsonData.files[i].properties) {
                tagsList = parseTags(jsonData.files[i].properties.tags)
            }
        }

        var isNameMatch = true
        if (!fileName.toLowerCase().includes(searchQuery.toLowerCase())) {
            isNameMatch = false
        }
        var isTagMatch = false
        for (const tag of tagsList) {
            if (tag.toLowerCase().includes(searchQuery.toLowerCase())) {
                isTagMatch = true
            }
        }
        
        switch(filter) {
            case FILTER_DEFAULT:
                if (!isTagMatch && !isNameMatch) {
                    continue
                }
                break
            case FILTER_NAME:
                if (!isNameMatch) {
                    continue
                }
                break
            case FILTER_TAGS:
                if (!isTagMatch) {
                    continue
                }
        }

        console.log(tagsList)

        // create a an entry for the current file returned
        fileListArray[i] = <FileResult fileName={fileName} fileURL={fileURL} fileID={fileID} thumbnailLink={thumbnailLink} modifiedTime={modifiedTime} tags={tagsList} key={fileID}/>
    }

    return fileListArray
}

export default ListView