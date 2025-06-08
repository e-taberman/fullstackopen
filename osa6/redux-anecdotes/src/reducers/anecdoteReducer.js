import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const getId = () => (100000 * Math.random()).toFixed(0)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      const updated = action.payload
      const index = state.findIndex(a => a.id === updated.id)
      if (index !== -1) {
        state[index] = updated
      }
    }
  }
})

export const { appendAnecdote, updateAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    await anecdotes.forEach(anecdote => {
      dispatch(appendAnecdote(anecdote))
    })
  }
}

export const addAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const addVote = (anecdote) => {
  return async dispatch => {
    const updateAnecdoted = {...anecdote, votes: anecdote.votes + 1}
    const anecdoteToChange = await anecdoteService.update(updateAnecdoted)
    dispatch(updateAnecdote(anecdoteToChange))
  }
}

export default anecdoteSlice.reducer