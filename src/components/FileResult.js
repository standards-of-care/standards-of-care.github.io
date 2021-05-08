import React from "react"
import { FiPlusCircle } from "react-icons/fi"
import {Link} from "react-router-dom"

function FileResult(props) {

  let tagsList = props.tags.map(txt => <div className="tag" key={txt}>{txt}</div>)
  
  return (
    <Link to={'./'+props.fileID} className="file-result">
      <img src={props.thumbnailLink} className="file-thumbnail"/>
      <div className="file-info">
        <div className="file-name-date">
          <span className="file-name">{props.fileName}</span>
          <span className="file-date">{props.modifiedTime}</span>
        </div>
        <span className="file-tags">{tagsList}</span>
      </div>
    </Link>
  )
}

function NewFile(props) {
  return (
    <Link to="/upload" className="file-result new-file">
      <span>Upload New File</span>
      <FiPlusCircle />
    </Link>
  )
}

export { FileResult, NewFile }