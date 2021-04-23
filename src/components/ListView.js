import React, {Fragment, useEffect, useState} from "react";

import {API_KEY, FOLDER_ID, FIELDS} from '../env'
import {getFileURL, parseModifiedTime, parseFileName} from '../Utilities'
import FileResult from './FileResult'
import {SearchSubHeader} from './Header'
import FileList from './FileList'

function ListView (props) {
    const [fileList, setFileList] = useState([])
    const [searchQuery, setSearchQuery] = useState("")

    // build the API search query to get a list of all files
    const filterQuery = "q='" + FOLDER_ID + "' in parents and name contains '" + searchQuery + "'"
    const apiQuery = "key=" + API_KEY
    const apiURL = "https://www.googleapis.com/drive/v3/files?"


    // run HTTP request and parse results into JSX elements
    const fetchFileList = async() => {
        const result = await fetch(apiURL + filterQuery + "&" + apiQuery + "&" + FIELDS + "&orderBy=name")
        const jsonData = await result.json()

        console.log(jsonData.files)

        var fileListArray = []
        for (var i = 0; i < jsonData.files.length; i++) {
            const fileName = parseFileName(jsonData.files[i].name)
            const fileID = jsonData.files[i].id
            const thumbnailLink = jsonData.files[i].thumbnailLink
            const modifiedTime = parseModifiedTime(jsonData.files[i].modifiedTime)
            const fileURL = getFileURL(fileID)

            // create a an entry for every file returned
            fileListArray[i] = <FileResult fileName={fileName} fileURL={fileURL} fileID={fileID} thumbnailLink={thumbnailLink} modifiedTime={modifiedTime} key={fileID}/>
        }
        
        setFileList(fileListArray)
    }

    // run fetchFileList() when component loads for the first time
    useEffect(() => {
        (async () => {
            fetchFileList()
        })()

    }, [searchQuery])

    // add list to the DOM
    return (
        <div className="main-view">
            <SearchSubHeader updateFunction={setSearchQuery} />
            <FileList files={fileList} />
        </div>
    )
}

export default ListView