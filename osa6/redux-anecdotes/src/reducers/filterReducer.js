const reducer = (state = '', action) => {
  switch(action.type) {
    case 'SET_FILTER':
      return action.payload

    default: return state
  }
}

export const filterChange = filter => {
  return {
    type: 'SET_FILTER',
    payload: filter
  }
}


// const reducer = (state = initialState, action) => {
//   switch(action.type) {
//     case 'VOTE':
//       const newState = [...state]

//       newState.map(anecdote => {
//         if (anecdote.id === action.id) {
//           anecdote.votes += 1
//         }
//       })

//       return newState

//     case 'CREATE':
//       const newAnecdote = asObject(action.content)
//       state = [...state, newAnecdote]
//       return state

//     default: return state
//   }
// }


export default reducer