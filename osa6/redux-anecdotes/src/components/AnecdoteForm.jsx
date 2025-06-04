import { useSelector, useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const createAnecdote = (event) => {
        event.preventDefault()
        const newAnecdote = event.target.anecdote.value

        if (newAnecdote === '') return

        event.target.anecdote.value = ''
        dispatch(addAnecdote(newAnecdote))
    }

    return (
        <form onSubmit={createAnecdote}>
            <h2>create new</h2>
            <div> <input name="anecdote"/> </div>
            <button type="submit">create</button>
        </form>
    )
}

export default AnecdoteForm