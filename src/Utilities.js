function getFileURL(fileID) {
    return ("https://drive.google.com/file/d/" + fileID)
  }
  
function parseModifiedTime(rawTime) {
return(rawTime.split('T')[0])
}

function parseFileName(rawFileName) {
return (rawFileName.split('.')[0])
}

export {getFileURL, parseModifiedTime, parseFileName}