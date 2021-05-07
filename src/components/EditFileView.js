import React, {useEffect, useState} from "react"
import {useParams, useHistory} from "react-router-dom"

import {FOLDER_ID, DRIVE_ID} from '../env'
import {SubmitButton, DeleteButton, EditName, FilePicker} from './FileManagement'
import {getAccessToken, parseFileName, parseTags} from '../Utilities'
import {FileTag, AddTag} from './FileTag'

const API_URL = "https://www.googleapis.com/drive/v3/files/"
const FIELDS = "?fields=*"

function EditFileView(props) {
    const [fileInfo, setFileInfo] = useState({
        name: "",
    })
    const [newFileInfo, setNewFileInfo] = useState({})
    const [globalTags, setGlobalTags] = useState([])
    const [fileTags, setFileTags] = useState([])
    const [uploadFile, setUploadFile] = useState(null)
    const [oauthToken, setOauthToken] = useState("")
    const [areChanges, setAreChanges] = useState(false)
    
    let {fileID} = useParams()
    const history = useHistory()

    const getFileInfo = async() => {
        const corporaParams = `includeItemsFromAllDrives=true&corpora=drive&supportsAllDrives=true`
        const driveParam = `driveId=${DRIVE_ID}`

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

    const getGlobalTags = async() => {
        const corporaParams = `includeItemsFromAllDrives=true&corpora=drive&supportsAllDrives=true`
        const driveParam = `driveId=${DRIVE_ID}`
        const filterParams = `?q='${FOLDER_ID}' in parents&fields=files(properties)`
        let url = `${API_URL}${filterParams}&${driveParam}&${corporaParams}`

        const result = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + oauthToken
            }
        })
        const jsonData = await result.json()

        let globalTagsList = []
        for (const item of jsonData.files) {
            let fileTagsList = parseTags(item.properties.tags)
            for (const tag of fileTagsList) {
                if (!globalTagsList.includes(tag)) {
                    globalTagsList.push(tag)
                }
            }
        }
        
        setGlobalTags(globalTagsList.sort())
    }

    const deleteFile = async() => {
        const corporaParams = `supportsAllDrives=true`
        const driveParam = `driveId=${DRIVE_ID}`

        let url = `${API_URL}${fileID}?${corporaParams}&${driveParam}`

        const result = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + oauthToken
            }
        })

        history.push('/')
    }

    useEffect( () => {
        (async () => {
            const oauth = await getAccessToken()
            setOauthToken(oauth.access_token)
        })()
    }, [])

    useEffect( () => {
        if (oauthToken != "") {
            if (!props.isNewFile){
                getFileInfo()
            }
            getGlobalTags()        
        }
    }, [oauthToken])

    useEffect( () => {
        if ("properties" in fileInfo) {
            if ("tags" in fileInfo.properties) {
                setFileTags(parseTags(fileInfo.properties.tags))
            }
        }

        setNewFileInfo({...fileInfo})
    }, [fileInfo])

    useEffect( () => {
        if (fileInfo.name != "") {
            let newTags = fileTags.join(',')
            newTags = (newTags !== "") ? newTags : null
            setNewFileInfo({...newFileInfo, properties: {
                tags: newTags
            } })
        }
    }, [fileTags])

    useEffect( () => {
        setAreChanges(areThereChanges())
    }, [newFileInfo, uploadFile])

    const removeTag = (tagName) => {
        let tmpArray = [...fileTags]
        const i = tmpArray.indexOf(tagName)
        if (i > -1) {
            tmpArray.splice(i, 1)
        }
        setFileTags(tmpArray.sort())
    }

    const addTag = (tagName) => {
        let tmpArray = [...fileTags]
        if (!tmpArray.includes(tagName)) {
            tmpArray.push(tagName)
            setFileTags(tmpArray.sort())
        }
    }

    const editName = (newFileName) => {
        setNewFileInfo({...newFileInfo, name: newFileName })

        console.log(`edited name ${newFileName}`)
    }

    const addFileToUpload = (event) => {
        const file = Array.from(event.target.files)[0]
        console.log(file)
        if (props.isNewFile && newFileInfo.name === "") {
            setNewFileInfo({...newFileInfo, name: file.name})
        }
        setUploadFile(file)
    }

    const removeFileToUpload = () => {
        if (uploadFile.name === newFileInfo.name) {
            setNewFileInfo({...newFileInfo, name: ""})
        }
        setUploadFile(null)
    }

    const getChanges = () => {
        let changes = {}
        for (const key of Object.keys(newFileInfo)) {
            let isDiff = false
            if ((typeof newFileInfo[key] === 'object') && (typeof fileInfo[key] === 'object')) {
                isDiff = JSON.stringify(newFileInfo[key]) !== JSON.stringify(fileInfo[key])
            } else {
                isDiff = !(newFileInfo[key] === fileInfo[key])
            }

            if (isDiff) {
                changes[key] = newFileInfo[key]
            }
            
        }

        return changes
    }

    const areThereChanges = () => {
        const areMetadataChanges = Object.keys(getChanges()).length > 0
        const areFileChanges = uploadFile !== null
        const isFileName = newFileInfo.name !== ""

        if (props.isNewFile) {
            return (areFileChanges && isFileName)
        } else {
            return (areMetadataChanges || areFileChanges)
        }
    }

    const submitChanges = async () => {
        const uploadFileURL = 'https://www.googleapis.com/upload/drive/v3/files/'
        const corporaParams = `includeItemsFromAllDrives=true&corpora=drive&supportsAllDrives=true`
        const driveParam = `driveId=${DRIVE_ID}`

        let changes = getChanges()
        console.log(JSON.stringify(changes))

        if (!props.isNewFile) {
            if (uploadFile !== null) {
                let url = `${uploadFileURL}${fileID}?${corporaParams}&${driveParam}`
                const result = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + oauthToken,
                        'Content-Type': 'application/pdf',
                        'Content-Length': uploadFile.size
                    },
                    body: uploadFile
                })
    
                console.log(result)
            }
    
            if (Object.keys(getChanges()).length > 0) {
                let url = `${API_URL}${fileID}?${corporaParams}&${driveParam}`
                const result = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + oauthToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(changes)
                })
    
                console.log(result)
            }
    
            history.push(`/${fileID}`)
        } else {
            let metadataUploadURL = `${API_URL}?${corporaParams}&${driveParam}`
            let metadataUploadBody = {...changes, parents: [FOLDER_ID]}
            const metadataResult = await fetch(metadataUploadURL, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + oauthToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(metadataUploadBody)
            })
            const jsonData = await metadataResult.json()

            let newFileID = jsonData.id
            let fileUploadURL = `${uploadFileURL}${newFileID}?uploadType=multipart&${corporaParams}&${driveParam}`
            const result = await fetch(fileUploadURL, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + oauthToken,
                    'Content-Type': 'application/pdf',
                    'Content-Length': uploadFile.size
                },
                body: uploadFile
            })

            history.push(`/${newFileID}`)
        }
    }

    let tagsList = fileTags.map(tagName => <FileTag tagName={tagName} isAuth={true} removeTag={removeTag} key={tagName} />)
    let addTagButton = <AddTag addTag={addTag} globalTags={globalTags} />
    let deleteButton = !props.isNewFile ? <DeleteButton fileName={fileInfo.name} deleteFile={deleteFile} /> : null

    return (
        <div className="main-view edit-main-view">
            <div className="edit-file">
                <span>File Name:</span>
                <EditName name={parseFileName(newFileInfo.name)} editName={editName} />

                <div id="tags-list">
                    <span className="tags-label">Tags:</span>
                    {tagsList}
                    {addTagButton}
                </div>

                <div id="file-upload">
                    <span>Upload New File:</span>
                    <FilePicker addFile={addFileToUpload} resetFile={removeFileToUpload} />
                </div>

                <div id="submit-delete-buttons">
                    <SubmitButton isNewFile={props.isNewFile} canSubmit={areChanges} submitChanges={submitChanges} />
                    {deleteButton}
                </div>
            </div>
        </div>
    )
}


export default EditFileView