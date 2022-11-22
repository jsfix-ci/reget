import Cookie from 'js-cookie'

export default function(cookieConf) {
  return {
    route: '/:key+',
    get(ctx) {
      const {key} = ctx.params
      ctx.body = JSON.parse(Cookie.get(key))
    },
    put(ctx) {
      const {key} = ctx.params
      const {input, cookieOptions} = ctx
      if (input === '') {
        Cookie.remove(key)
      } else {
        ctx.body = Cookie.set(key, JSON.stringify(input), {
          ...cookieConf,
          ...cookieOptions,
        })
      }
    },
  };
}
