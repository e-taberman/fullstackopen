import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const createAnecdote = async (event) => {
        event.preventDefault()
        const newAnecdote = event.target.anecdote.value

        if (newAnecdote === '') return

        dispatch(setNotification(`You created "${newAnecdote}"`, 3))

        event.target.anecdote.value = ''
        dispatch(addAnecdote(newAnecdote))

        await anecdoteService.createNew(newAnecdote)
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