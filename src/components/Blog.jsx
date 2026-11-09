import { useEffect, useState } from 'react'
import Nav from './Nav'
import Article from './Article'
import ArticleEntry from './ArticleEntry'
import { fetchArticles, createArticle } from '../services/articleService'
import './Blog.css'

export default function Blog({ onSignOut }) {
  const [articles, setArticles] = useState([])
  const [article, setArticle] = useState(null)
  const [writing, setWriting] = useState(null)

  // This is a trivial app, so just fetch all the articles once, when
  // the app is loaded. A real app would do pagination. Note that
  // "fetchArticles" is what gets the articles from the service and
  // then "setArticles" writes them into the React state.
  useEffect(() => {
    //fetchArticles().then(setArticles)
    const retriveArticles = async () => {
      const articles = await fetchArticles()
      setArticles(articles)
    }

    retriveArticles()
  }, [])

  // Update the "database" *then* update the internal React state. These
  // two steps are definitely necessary.
  function addArticle({ title, body }) {
    createArticle({ title, body }).then(article => {
      setArticle(article)
      setArticles([article, ...articles])
      setWriting(false)
    })
  }

  return (
    <div className="Blog">
      <header>
        <span>Bare Bones Blog 🦴</span>
        <button onClick={() => setWriting(true)}>New Article</button>
        <button onClick={onSignOut}>Sign Out</button>
      </header>
      <Nav articles={articles} setArticle={setArticle} />
      {writing ? <ArticleEntry addArticle={addArticle} /> : <Article article={article} />}
    </div>
  )
}
