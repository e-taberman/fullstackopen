import { useState, useEffect } from 'react'
import InputField from './InputField'

const BlogCreator = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const updatedBlog = {
      "title": title,
      "author": author,
      "url": url
    };
    props.setNewBlog(updatedBlog);
  }, [title, author, url]);

  return (
    <div>
      <h2>create new blog</h2>
      <InputField text="title:" setValue={setTitle}></InputField>
      <InputField text="author:" setValue={setAuthor}></InputField>
      <InputField text="url:" setValue={setUrl}></InputField>
      <button onClick={props.onSubmit} >create</button>
    </div>
  )
}

export default BlogCreator