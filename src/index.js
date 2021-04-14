const api = 'http://localhost:8000/metrics'

window.addEventListener('load', () => {
    let url = window.location.href
    let performance = window.performance.toJSON()

    let data = {
        "url": url,
        "date": performance.timeOrigin,
        "metrics": performance.timing,
    }

    console.log("Perfanalytics Object : ", data)

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }

    fetch(api, options).then((response) => console.log(response))
})