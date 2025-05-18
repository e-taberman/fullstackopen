export const Header = (props) => {
  return (
    <h2>{props.course.name}</h2>
  )
}

export const Content = (props) => {
  const exerciseCount = props.course.parts.reduce(
    (sum, part) => sum + part.exercises, 0
  )
  return (
    <div>
      {props.course.parts.map((part, i) =>
          <Part key={props.course.parts[i].id} part={props.course.parts[i].name} exercises={props.course.parts[i].exercises}/>
      )}
      <Total total={exerciseCount} />
    </div>
  )
}

export const Part = (props) => {
  return (
    <p>{props.part} {props.exercises}</p>
  )
}

export const Total = (props) => {
  return (
    // <p><b>total of exercises {props.course.parts[0].exercises + props.course.parts[1].exercises+ props.course.parts[2].exercises}</b></p>
    <p><b>total of exercises {props.total}</b></p>
  )
}

export const Course = (props) => {
  return (
    <div>
      <Header course={props.course} />
      <Content course={props.course} />
    </div>
  )
}