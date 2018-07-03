asyncDeferrer ![building status](https://api.travis-ci.org/drpicox/async-deferrer.svg?branch=master)
=============

Creates a deferrer, which is 
a function that behaves very similar to a deferred object:
it allows the get and the resolve of a promise.

It allows the creation of more expressive tests.
The reason for this library is just matter of expressiveness.


Quick Use
---------

Install with npm:

```bash
npm install async-deferrer
```

Use in your code:

```javascript
import makeAsyncDeferrer from 'async-deferrer'

test("setTimeout logs correctly", async () => {
  const log = []
  const timeoutFinished = makeAsyncDeferrer()
 
  setTimeout(async () => {
    log.push("timeout")
    timeoutFinished(true)
  })
 
  log.push("begin")
  await timeoutFinished()
  log.push("end")
 
  expect(log).toEqual(["begin", "timeout", "end"])
})
```


makeAsyncDeferrer()
-------------------

It creates a function that can be used as a defer.

```javascript
import makeAsyncDeferrer from 'async-deferrer'

const asyncDeferrer = makeAsyncDeferrer()
```

### asyncDeferrer(resolutionValue?: any): Promise

The resulting function returns always a promise that
will be satisfied when the function is called with an argument.

```javascript
import makeAsyncDeferrer from 'async-deferrer'

const asyncDeferrer = makeAsyncDeferrer()

// you can get the promise at any moment as follows
const promise = asyncDeferrer()

// it resolves the promise with the given value
asyncDeferrer('resolve promise with this string')

// you can await the promise as follows
await promise
// or directly using a function call
await asyncDeferrer()
```

The promise is resolved once, 
further invokes with other arguments 
are ignored.

You can call to the asyncDeferrer function as many times as you want.


### asyncDeferrer.reject(rejectionValue): Promise

You can reject the promise if you consider convenient:

```javascript
asyncDeferrer.reject('promise rejected')

try {
  await asyncDeferrer()
} catch (error) {
  // logs 'promise rejected'
  console.log(error)
}
```

Because the promise is resolved once, 
further invokes with other arguments 
are ignored. 
Further invokes to resolve the promise 
are also ignored.


Alternatives
------------

There are other libreries or ways
that could help you to writte the desired
asynchronous code.

### (pDefer)[https://github.com/sindresorhus/p-defer]

It is a library from (Sindre Sorhus)[https://github.com/sindresorhus)
part of his large list of [p-*](https://github.com/sindresorhus/promise-fun).

The code for the same presentation shouwn before could be something like:

```javascript
import pDefer from 'p-defer'

test("setTimeout logs correctly", async () => {
  const log = []
  const timeoutDeferred = pDefer()
 
  setTimeout(async () => {
    log.push("timeout")
    timeoutDeferred.resolve()
  })
 
  log.push("begin")
  await timeoutDeferred.promise
  log.push("end")
 
  expect(log).toEqual(["begin", "timeout", "end"])
})
```

### Plain promises

The same behaviour can be achieved with plain promises. 

```javascript
test("setTimeout logs correctly", async () => {
  const log = []
 
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(async () => {
      log.push("timeout")
      resolve()
    })
  })
 
  log.push("begin")
  await timeoutPromise
  log.push("end")
 
  expect(log).toEqual(["begin", "timeout", "end"])
})
```


Why asyncDeferrer instead of Promises or defer
-------------------------------------------------

It is cleaner an easier to read.

If we compare all three presented cases:

```javascript
// asyncDeferrer
timeoutFinished(true)
// pDefer
timeoutDeferred.resolve()
// Promise
resolve()
```

The first of three writings is the most easy to enderstand version.
Just reading we knew that we are telling that the timeout is finished.
The promise version could be rewrote as:

```javascript
// rewrote of Promise version
const timeoutFinished = new Promise((flagTimeoutFinished) => {
  setTimeout(async () => {
    log.push("timeout")
    flagTimeoutFinished()
  })
})
```

But it still has the `new Promise(() => {})` boilerplate code
and not always easy to use.


Using asyncDeferrer as checkpoints
----------------------------------

It in fact is the intention of this library, 
to ensure that the execution flow is what we expect.

```javascript
import makeAsyncDeferrer from "async-deferrer"
 
test('synchronize multiple steps in the correct order', async () => {
    const log = []
    const startStep1 = makeAsyncDeferrer()
    const startStep2 = makeAsyncDeferrer()
    const finishedStep2 = makeAsyncDeferrer()
    ;(async () => {
      await startStep2()
      log.push('step 2')
      finishedStep2(true)
    })()
    ;(async () => {
      await startStep1()
      log.push('step 1')
      startStep2(true)
    })()

    log.push('begin')
    startStep1(true)
    await finishedStep2()
    log.push('end')

    expect(log).toEqual(['begin', 'step 1', 'step 2', 'end'])
  })
```


See also
--------

- [async-barrier](https://github.com/drpicox/async-barrier): 
  it is the library that inspired this one, 
  and originally was designed to 
  ensure that multiple async functions
  reaches the same point at the same time

- [pDefer](https://github.com/sindresorhus/p-defer): 
  traditional defer library generated from the system Promise

- [p-*](https://github.com/sindresorhus/promise-fun):
  lots of Promise utilities created by the guy behind `pDefer`.
