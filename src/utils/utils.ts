/// <reference types="vite/client" />

const mode = import.meta.env.MODE

const Log = mode === 'development' ? console.log.bind(console) : function () {}
const LogError = mode === 'development' ? console.error.bind(console) : function () {}

export { Log, LogError }
