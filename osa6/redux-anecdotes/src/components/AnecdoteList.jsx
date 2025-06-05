import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  let anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()
  const vote = (id) => dispatch(addVote(id))

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