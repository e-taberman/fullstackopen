import PropTypes from 'prop-types'

const InputField = ({ text, setValue, inputValue }) => {
  return (
    <div>
      {text} <input type="text" onChange={event => setValue(event.target.value)} value={inputValue} ></input>
    </div>
  )
}

InputField.propTypes = {
  text: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired
}

export default InputField