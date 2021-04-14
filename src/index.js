const api = ''

let url = window.location.href
let performance = window.performance.toJSON()

let obj = {
    "url": url,
    "metrics": performance,
}

console.log("Perfanalytics Date : ", Date(performance.timeOrigin))
console.log("Perfanalytics Object : ", obj)

const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'no-cors',
    body: JSON.stringify(obj),
}

fetch(api, options).then((response) => console.log(response))