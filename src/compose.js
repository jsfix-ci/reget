import _ from 'lodash'
import SyncPromise from './SyncPromise'


function runMiddlewares(ctx, middlewares, i = 0) {
  const curMiddleware = middlewares[i]
  if (!curMiddleware) return new SyncPromise(ctx)

  let result
  let error
  try {
    result = curMiddleware(ctx, function next () {
      return runMiddlewares(ctx, middlewares, i + 1)
    })
  } catch(err) {
    error = err
  }

  return SyncPromise.resolve(result, error)
}


export default function compose() {
  const middlewareArray = []

  const runner = function(ctx) {
    return runMiddlewares(ctx, middlewareArray)
    .then(() => ctx)
  }

  runner.use = function(...middlewareArrays) {
    _.each(middlewareArrays, fn => {
      if (!fn) return this
      if (Array.isArray(fn)) {
        fn.forEach(f => middlewareArray.push(f))
      } else {
        middlewareArray.push(fn)
      }
    })
    return this
  }

  runner.use.apply(runner, arguments)

  return runner
}