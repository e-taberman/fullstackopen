import { setFilter } from "../reducers/filterReducer"
import { useSelector, useDispatch } from 'react-redux'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    var newFilter = event.target.value
    dispatch(setFilter(newFilter))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter