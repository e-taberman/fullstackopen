import { useSelector, useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const createAnecdote = (event) => {
        event.preventDefault()
        const newAnecdote = event.target.anecdote.value

        if (newAnecdote === '') return

        dispatch(setNotification(`You created "${newAnecdote}"`))

        event.target.anecdote.value = ''
        dispatch(addAnecdote(newAnecdote))

        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
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