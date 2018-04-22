"use strict" ;

import '../sass/main.sass'

// HTMLElements
let theadResult = document.querySelector("#result thead")
let tbodyResult = document.querySelector("#result tbody")

let getLastStat = (url, data) => {
  console.log(data)
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("post", url, true)
    //xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onload = () => resolve(xhr.responseText)
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send(JSON.stringify(data))
  });
}

getLastStat("/top100/api/getstat", {"env": "env1"})
  .then(result => {
    console.log(result)
    
    theadResult.innerHTML = "<tr><th>" +
      JSON.parse(result).metaData.map(column => column.name).join("</th><th>") +
      "</th></tr>"
    tbodyResult.innerHTML = "<tr><td>" +
      JSON.parse(result).rows.map(row => row.join("</td><td>")).join("</td></tr><tr><td>") +
      "</td></tr>"

  })
  .catch(error => console.log(error))