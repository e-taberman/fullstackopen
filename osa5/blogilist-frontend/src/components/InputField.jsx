const InputField = (props) => {
  return (
    <div>
      {props.text} <input type="text" onChange={event => props.setValue(event.target.value)} ></input>
    </div>
  )
}

export default InputField