import { useSelector, useDispatch } from 'react-redux'
import { addVote, addAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import Notification from './Notification'

const AnecdoteList = () => {
  let anecdotes = useSelector(state => state.anecdotes)


  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const vote = (id) => {
    const votedAnecdote = anecdotes.find(anecdote => anecdote.id === id)
    dispatch(addVote(id))
    dispatch(setNotification(`You voted "${votedAnecdote.content}"`))

    setTimeout(() => {
      dispatch(clearNotification())
    }, 5000)
  }

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )
  anecdotes = filteredAnecdotes

  return (
    <div>
      {anecdotes.slice().sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <div key={anecdote.id}>
            <div> {anecdote.content} </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)} >vote</button>
            </div>
            <br></br>
          </div>
        )}
    </div>
  )
}


export default AnecdoteList
