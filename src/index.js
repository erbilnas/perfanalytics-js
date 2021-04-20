// Variables
const api = 'https://perfapp-api.herokuapp.com/metrics'
const url = window.location.href
const performanceTiming = window.performance.toJSON().timing
const currentTime = new Date().valueOf()
var fcp, ttfb, windowLoad, domLoad

// Converting ms to seconds
const convertMsToSecond = (ms) => {
    return (ms / 1000)
}

// FCP metric to observe (https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)
const startObserver = () => {
    if (typeof PerformanceObserver !== 'function') {
        console.error("PerfanalyticsJS Error : PerformanceObserver NOT supported!")
        return
    }

    let observer = new PerformanceObserver((entryList) => {
        fcp = convertMsToSecond(entryList.getEntriesByName('first-contentful-paint')[0].startTime)
    })

    observer.observe({ type: 'paint', buffered: true })
}


const sendRequest = () => {
    const request = setInterval(() => {
        let data = {
            "url": url,
            "date": performance.timeOrigin,
            "ttfb": ttfb, // Time to first byte
            "fcp": fcp, // First contentful paint
            "domLoad": domLoad,
            "windowLoad": windowLoad,
        }

        console.log("PerfanalyticsJS Request Object : ", data)

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }

        fetch(api, options).then((response) => console.debug(response))

        clearInterval(request)
    }, 500) // This interval has been set because the PerformanceObserver runs after the window is loaded
}

// Retrieving and analysing of detailed network timing data regarding the loading of an application's resources
const displayResources = () => {
    if (!window.performance) {
        console.error("PerfanalyticsJS Error : Performance NOT supported!")
        return
    }

    var resources = window.performance.getEntriesByType('resource')

    console.log("PerfanalyticsJS Resource Data : ")

    resources.forEach((resource) => {
        console.log("Resource - Name : " + resource.name + " | Type : " + resource.initiatorType)
        console.log("-- Response time = " + convertMsToSecond(resource.responseEnd - resource.responseStart))
        console.log("-- Request start until response end time = " + convertMsToSecond((resource.requestStart > 0) ? (resource.responseEnd - resource.requestStart) : "0"))
        console.log("-- Fetch until response end time = " + convertMsToSecond((resource.fetchStart > 0) ? (resource.responseEnd - resource.fetchStart) : "0"))
        console.log("-- Start until response end time = " + convertMsToSecond((resource.startTime > 0) ? (resource.responseEnd - resource.startTime) : "0"))
    })
}

// Calculating performance-related information for the current page
const getPerformanceTiming = () => {
    if (!performanceTiming) {
        console.error("PerfanalyticsJS Error : Performance NOT supported!")
        return
    }

    ttfb = convertMsToSecond(performanceTiming.responseStart - performanceTiming.navigationStart)
    domLoad = convertMsToSecond(performanceTiming.domContentLoadedEventEnd - performanceTiming.navigationStart)
    windowLoad = convertMsToSecond(currentTime - performanceTiming.navigationStart)
}

window.addEventListener('load', () => {
    startObserver()
    getPerformanceTiming()
    displayResources()
    sendRequest()
})