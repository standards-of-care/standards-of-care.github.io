import logo from './logo.svg';
import React, {Fragment, useEffect, useState} from "react";
import './App.css';

const FOLDER_ID = '12OGdVgcRvXEkw-eJsG4uJF5RyfTikEV0' // test folder on my google drive, hardcoded for now
const API_KEY = 'AIzaSyBOs5HKZSw6hFG90oX1mUD5K1t3ayMFx-E' // hardcoded google drive api key for now
const FIELDS = 'fields=files(id, name, thumbnailLink, modifiedTime)' // list of fields to return from API

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedFile: null
    }
  }

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0]
    })
  }

  render() {
    return (
      <div className="App">
        <APICall />
      </div>
    )
  }
}

class FileResult extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <a href={this.props.fileURL} className="file-result">
        <img src={this.props.thumbnailLink} className="file-thumbnail"/>
        <div className="file-info">
          <span className="file-name">{this.props.fileName}</span>
          <span className="file-date">{this.props.modifiedTime}</span>
        </div>
      </a>
    )
  }
}

function APICall (props) {
  const [fileList, setFileList] = useState([])

  // build the API search query to get a list of all files
  const searchQuery = "q='" + FOLDER_ID + "' in parents"
  const apiQuery = "key=" + API_KEY
  const apiURL = "https://www.googleapis.com/drive/v3/files?"

  // run HTTP request and parse results into JSX elements
  const fetchFileList = async() => {
    const result = await fetch(apiURL + searchQuery + "&" + apiQuery + "&" + FIELDS)
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
      fileListArray[i] = <FileResult fileName={fileName} fileURL={fileURL} thumbnailLink={thumbnailLink} modifiedTime={modifiedTime} key={fileID}/>
    }
    
    setFileList(fileListArray)
  }

  // run fetchFileList() when component loads for the first time
  useEffect(() => {
    fetchFileList()
  }, [])

  // add list to the DOM
  return (
    <div className="drive-file-list">{fileList}</div>
  )
}

function getFileURL(fileID) {
  return ("https://drive.google.com/file/d/" + fileID)
}

function parseModifiedTime(rawTime) {
  return(rawTime.split('T')[0])
}

function parseFileName(rawFileName) {
  return (rawFileName.split('.')[0])
}

export default App;
