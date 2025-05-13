import { useState } from 'react'

const Header = (props) => <h1>{props.text}</h1>

const Button = (props) => <button onClick={props.onClick}>{props.text}</button>

const Statistics = (props) => {
  if (props.all == 0) {
    return <div>No feedback given</div>
  }

  return (
    <table>
      <tbody>
        <StatisticsLine text="good" value={props.good}/>
        <StatisticsLine text="neutral" value={props.neutral}/>
        <StatisticsLine text="bad" value={props.bad}/>
        <StatisticsLine text="all" value={props.all}/>
        <StatisticsLine text="average" value={props.average}/>
        <StatisticsLine text="positive" value={props.positive}/>
      </tbody>
    </table>
  )
}

const StatisticsLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [selected, setSelected] = useState(0)
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)
  const [bestAnecdote, setBestAnecdote] = useState(anecdotes[selected])

  const addValue = (name) => {
    const newValues = {
      good: good,
      neutral: neutral,
      bad: bad,
      all: all + 1
    }

    newValues[name] += 1

    setGood(newValues.good)
    setNeutral(newValues.neutral)
    setBad(newValues.bad)
    setAll(newValues.all)
    setAverage((newValues.good - newValues.bad) / newValues.all)
    setPositive((newValues.good / newValues.all * 100) + "%")
  }

  const changeRandomAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const addVote = () => {
    const newVotes = { ...votes }
    newVotes[selected] += 1
    setVotes(newVotes)
    setMostVotedAnecdote(newVotes)
  }

  const setMostVotedAnecdote = (newVotes) => {
    const highestKey = Object.entries(newVotes).reduce((highest, [key, value]) => {
      return value > newVotes[highest] ? key : highest;
    }, Object.keys(newVotes)[0]);

    setBestAnecdote(anecdotes[highestKey])
  }

  return (
    <div>
      <Header text="Give feedback"/>
      <Button onClick={() => addValue("good")} text="good"/>
      <Button onClick={() => addValue("neutral")} text="neutral"/>
      <Button onClick={() => addValue("bad")} text="bad"/>
      <br></br>
      <Header text="Statistics"/>
      <Statistics good={good} bad={bad} neutral={neutral} all={all} average={average} positive={positive}/>
      <Header text="Anecdote of the day"/>
      <div>{anecdotes[selected]}</div>
      <div>has {votes[selected]} votes</div>
      <Button onClick={addVote} text="vote"/>
      <Button onClick={changeRandomAnecdote} text="next anecdote"/>
      <Header text="Anecdote with most votes"/>
      <div>{bestAnecdote}</div>
    </div>
  )
}

export default App