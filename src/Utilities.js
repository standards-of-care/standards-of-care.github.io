import jws from "jws"
import {ISS, SCOPE, PRIVATE_KEY} from './env'

function getFileURL(fileID) {
    return ("https://drive.google.com/file/d/" + fileID)
  }
  
function parseModifiedTime(rawTime) {
  try {
    return(rawTime.split('T')[0])
  } catch {
    return(rawTime)
  }
}

function parseFileName(rawFileName) {
  try {
    return (rawFileName.replace('.pdf', ''))
  } catch {
    return (rawFileName)
  }
}

function parseTags(rawTags) {
  return (rawTags.split(',').sort())
}

const getAccessToken = async() => {
  let header = {
      alg: "RS256",
      typ: "JWT"
  }
  let body = {
      iss: ISS,
      scope: SCOPE,
      aud: "https://oauth2.googleapis.com/token",
      "exp": Math.floor(Date.now() / 1000) + 3600,
      "iat": Math.floor(Date.now() / 1000)
  }

  let jwt = jws.sign({
      header: header,
      payload: body,
      secret: PRIVATE_KEY
  })

  const result = await fetch("https://oauth2.googleapis.com/token", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" + jwt
  })
  const jsonData = await result.json()
  
  return jsonData
}

export {getFileURL, parseModifiedTime, parseFileName, parseTags, getAccessToken}