const api = ''

var title = document.title
var url = window.location.href
var performance = window.performance.toJSON()

var obj = {
    "title": title,
    "url": url,
    "metrics": performance,
}

console.log("Object : ", obj)

const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'no-cors',
    body: JSON.stringify(obj),
}

fetch(api, options).then((response) => console.log(response))