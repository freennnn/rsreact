export const inDevEnvironment = !!process && process.env.NODE_ENV === 'development'

const Log = inDevEnvironment ? console.log.bind(console) : function () {}
const LogError = inDevEnvironment ? console.error.bind(console) : function () {}

export { Log, LogError }
