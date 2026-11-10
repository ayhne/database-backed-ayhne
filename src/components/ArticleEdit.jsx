import { useState } from 'react'

export default function ArticleEdit({ article, saveArticle, cancelEdit }) {
  const [title, setTitle] = useState(article.title)
  const [body, setBody] = useState(article.body)
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setError(null)

    if (!title.trim() || !body.trim()) {
      setError('Both the title and body must be supplied')
      return
    }

    try {
      await saveArticle({
        id: article.id,
        title,
        body
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <form onSubmit={submit}>
        {error && <p className="error">{error}</p>}
        Title
        <input value={title} onChange={e => setTitle(e.target.value)} />
        Body
        <textarea rows="8" value={body} onChange={e => setBody(e.target.value)} />
        <button type="submit">Save Changes</button>
        <button type="button" onClick={cancelEdit}>
          Cancel
        </button>
      </form>
    </div>
  )
}
