import logo from './logo.svg';
import React, {Fragment, useEffect, useState} from "react";
import './App.css';

const FOLDER_ID = '12OGdVgcRvXEkw-eJsG4uJF5RyfTikEV0' // test folder on my google drive, hardcoded for now
const API_KEY = 'AIzaSyBOs5HKZSw6hFG90oX1mUD5K1t3ayMFx-E' // hardcoded google drive api key for now

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
      <APICall />
    )
  }
}

class FileResult extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <a href={this.props.fileURL}>{this.props.fileName}</a>
    )
  }
}

function APICall (props) {
  const [fileList, setFileList] = useState([])

  // build the API search query to get a list of all files
  const searchQuery = "q='" + FOLDER_ID + "' in parents"
  const apiQuery = "key=" + API_KEY
  const url = "https://www.googleapis.com/drive/v3/files?"

  // run HTTP request and parse results into JSX elements
  const fetchFileList = async() => {
    const result = await fetch(url + searchQuery + "&" + apiQuery)
    const jsonData = await result.json()

    var fileListArray = []
    for (var i = 0; i < jsonData.files.length; i++) {
      const fileName = jsonData.files[i].name
      const fileID = jsonData.files[i].id
      const fileURL = getFileURL(fileID)

      // create a link to each file returned
      fileListArray[i] = <FileResult fileName={fileName} fileURL={fileURL} key={fileID}/>
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

export default App;
