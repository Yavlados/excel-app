import '@styles/index.scss'

console.log('preAsync')
async function start() {
  return await Promise.resolve('Async test')
}

start().then(console.log)
console.log('AfterAsync!')
