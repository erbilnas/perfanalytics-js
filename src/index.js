const api = 'http://localhost:8000/metrics'
const url = window.location.href
const currentDate = new Date().valueOf()
const performanceTiming = window.performance.toJSON().timing
var fcp, ttfb, windowLoad, domLoad

const convertMsToSecond = (ms) => { return (ms / 1000) }

const startObserver = () => {
    if (typeof PerformanceObserver !== 'function') return
    let observer = new PerformanceObserver((entryList) => {
        fcp = convertMsToSecond(entryList.getEntriesByName('first-contentful-paint')[0].startTime)
    })
    observer.observe({ type: 'paint', buffered: true })
}

const sendRequest = () => {
    const request = setInterval(() => {
        let data = {
            "url": url,
            "date": Date(performance.timeOrigin).valueOf(),
            "ttfb": ttfb,
            "fcp": fcp,
            "domLoad": domLoad,
            "windowLoad": windowLoad,
        }
        console.log("Perfanalytics Object : ", data)
        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }
        fetch(api, options).then((response) => console.log(response))
        clearInterval(request)
    }, 500)
}

window.addEventListener('load', () => {
    if (!window && !window.performance) return
    ttfb = convertMsToSecond(performanceTiming.responseStart - performanceTiming.navigationStart)
    domLoad = convertMsToSecond(performanceTiming.domContentLoadedEventEnd - performanceTiming.navigationStart)
    windowLoad = convertMsToSecond(currentDate - performanceTiming.navigationStart)
    startObserver()
    sendRequest()
})