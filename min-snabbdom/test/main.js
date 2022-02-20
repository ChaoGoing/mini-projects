import { h, init } from '../src'

const patch = init([])

const rootVnode = h('div', 'hello world')

patch(document.getElementById('app'), rootVnode)
