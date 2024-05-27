const promiseMap = {}

// 使用标志位实现可取消的promise
const makeCancelablePromise = (promise) => {
  let isCanceled = false
  const tempPromise = new Promise((resolve, reject) => {
    promise.then(res => {
      if (!isCanceled) {
        resolve(res)
      }
    }).catch(reject)
  })
  tempPromise.cancel = () => {
    isCanceled = true
  }
  return tempPromise
}

const makeSingletonPromise = (promiseKey, promise) => {
  // 取消上一个promise的运行
  promiseMap[promiseKey] && promiseMap[promiseKey].cancel()
  promiseMap[promiseKey] = makeCancelablePromise(promise)
  return promiseMap[promiseKey]
}

export default makeSingletonPromise