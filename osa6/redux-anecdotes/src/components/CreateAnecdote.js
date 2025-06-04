import { addAnecdote } from '../reducers/anecdoteReducer'

const CreateAnecdote = (event, dispatch) => {
    event.preventDefault()
    const newAnecdote = event.target.anecdote.value

    if (newAnecdote === '') return

    event.target.anecdote.value = ''
    dispatch(addAnecdote(newAnecdote))
}

export default CreateAnecdote