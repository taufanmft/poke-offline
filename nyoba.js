const set = require('lodash/set')
const get = require('lodash/get')
const findIndex = require('lodash/findIndex')
console.log('PANPANPAN')
const data = {
    listTodoLists: {
        items: [
            {
                __typename: 'TodoList',
                title: 'tasya2',
                id: '02ccc668-de48-48fd-9249-9681bb1b3875',
                description: 'happy ever after did exist'
            },
            {
                __typename: 'TodoList',
                title: 'gabrielle',
                id: '9f9f819b-837c-488f-a4ad-e17b3198915b',
                description: 'jesus'
            },
            {__typename: 'TodoList', title: 'tasya3', id: 'a61183d1-1e05-4518-875f-741aeeccfc8e', description: 'check'},
        ],
    },
    length: 15,
    __typename: "ModelTodoListConnection"
}

console.log('the index:', findIndex(get(data, 'listTodoLists.items'), {id: '9f9f819b-837c-488f-a4ad-e17b3198915b'}))

set(data, 'listTodoLists.items[0]', {title: 'tasyaa'})
console.log(data.listTodoLists.items[0])

