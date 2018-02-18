function makeAsyncDeferrer() {
  var resolve
  var reject
  var promise = new Promise(function(promiseResolve, promiseReject) {
    resolve = promiseResolve
    reject = promiseReject
  })

  function asyncDeferrer(resolution) {
    if (arguments.length) {
      resolve(resolution)
    }

    return promise
  }

  asyncDeferrer.reject = function rejectAsyncDeferrer(reason) {
    reject(reason)

    return promise
  }

  return asyncDeferrer
}

module.exports = makeAsyncDeferrer
