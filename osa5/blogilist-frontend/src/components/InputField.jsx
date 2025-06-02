import PropTypes from 'prop-types'

const InputField = ({ text, setValue, inputValue, id }) => {
  return (
    <div>
      <label htmlFor={id}>{text}</label>
      <input data-testid={id} id={id} value={inputValue} onChange={e => setValue(e.target.value)} />
    </div>
  )
}

InputField.propTypes = {
  text: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
}

export default InputField