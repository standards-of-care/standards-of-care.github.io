import React from "react"
import {Link} from "react-router-dom"

class FileResult extends React.Component {
    constructor(props) {
      super(props)
    }
  
    render() {
      return (
        <Link to={'./'+this.props.fileID} className="file-result">
          <img src={this.props.thumbnailLink} className="file-thumbnail"/>
          <div className="file-info">
            <span className="file-name">{this.props.fileName}</span>
            <span className="file-date">{this.props.modifiedTime}</span>
          </div>
        </Link>
      )
    }
}

export default FileResult