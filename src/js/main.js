"use strict" ;

import '../sass/main.sass'


//document.querySelector("#result tbody").appendChild()

// TODO not working
let getLastStat = (url, data) => {

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", url, true)
    xhr.setRequestHeader('Content-type', 'application/json')
    xhr.onload = () => resolve(xhr.responseText)
    xhr.onerror = () => reject(xhr.statusText)
    xhr.send(data)
  });
}

getLastStat("/top100/api/getstat", {"env": "env1"})
  .then(result => console.log(result))
  .catch(error => console.log(error))