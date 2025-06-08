import { useSelector, useDispatch } from 'react-redux'
import { addVote, addAnecdote, appendAnecdote, initializeAnecdotes, updateAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'
import { useEffect } from 'react'

const AnecdoteList = () => {


  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [])

  let anecdotes = useSelector(state => state.anecdotes)

  const vote = (id) => {
    const votedAnecdote = anecdotes.find(anecdote => anecdote.id === id)
    const updatedAnecdote = dispatch(addVote(votedAnecdote))
    dispatch(setNotification(`You voted "${votedAnecdote.content}"`, 3))
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
