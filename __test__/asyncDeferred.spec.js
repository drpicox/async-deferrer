const makeAsyncDeferrer = require('../')

describe('makeAsyncDeferrer', () => {
  it('creates a function that returns a promise, and it resolves when you give an argument', async () => {
    const asyncDeferrer = makeAsyncDeferrer()

    const promise = asyncDeferrer()
    asyncDeferrer(true)

    await expect(promise).resolves.toBe(true)
  })

  it('can be rejected with Promise.reject', async () => {
    const asyncDeferrer = makeAsyncDeferrer()

    const promise = asyncDeferrer()
    asyncDeferrer(Promise.reject('error'))

    await expect(promise).rejects.toBe('error')
  })

  it('gives an utility method called reject to reject the promise', async () => {
    const asyncDeferrer = makeAsyncDeferrer()

    const promise = asyncDeferrer()
    asyncDeferrer.reject('error')

    await expect(promise).rejects.toBe('error')
  })

  it('do not allow to change the value once is resolved', async () => {
    const asyncDeferrer = makeAsyncDeferrer()

    asyncDeferrer('first resolution')
    asyncDeferrer('second resolution')
    const promise = asyncDeferrer()

    await expect(promise).resolves.toBe('first resolution')
  })

  it('also returns the promise when is resolved', async () => {
    const asyncDeferrer = makeAsyncDeferrer()

    const promise = asyncDeferrer('resolved')

    await expect(promise).resolves.toBe('resolved')
  })

  it('also returns the promise when is rejected', async () => {
    const asyncDeferrer = makeAsyncDeferrer()

    const promise = asyncDeferrer.reject('error')

    await expect(promise).rejects.toBe('error')
  })

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
})
