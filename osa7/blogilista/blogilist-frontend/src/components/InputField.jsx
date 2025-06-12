import PropTypes from "prop-types";
import Form from "react-bootstrap/Form";

const InputField = ({ text, setValue, inputValue, id, type = "text" }) => {
  return (
    <Form.Group className="mb-3" style={{ maxWidth: "250px" }}>
      <Form.Label>{text}</Form.Label>
      <Form.Control
        data-testid={id}
        id={id}
        type={type}
        value={inputValue}
        onChange={(e) => setValue(e.target.value)}
        autoComplete={id}
      />
    </Form.Group>
  );
};

InputField.propTypes = {
  text: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default InputField;
