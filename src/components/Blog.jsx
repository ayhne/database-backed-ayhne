import { useEffect, useState } from 'react'
import Nav from './Nav'
import Article from './Article'
import ArticleEntry from './ArticleEntry'
import ArticleEdit from './ArticleEdit'
import {
  fetchArticles,
  createArticle,
  updateArticle as updateArticleInDatabase,
  deleteArticle as deleteArticleFromDatabase
} from '../services/articleService'
import './Blog.css'

export default function Blog({ onSignOut }) {
  const [articles, setArticles] = useState([])
  const [article, setArticle] = useState(null)
  const [writing, setWriting] = useState(null)
  const [editing, setEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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
  // Create a new article
  function addArticle({ title, body }) {
    createArticle({ title, body }).then(article => {
      setArticle(article)
      setArticles([article, ...articles])
      setWriting(false)
    })
  }

  // Update an existing article
  async function saveArticle({ id, title, body }) {
    const updatedArticle = await updateArticleInDatabase(id, { title, body })

    setArticles(articles.map(a => (a.id === updatedArticle.id ? updatedArticle : a)))

    setArticle(updatedArticle)
    setEditing(false)
  }

  async function removeArticle() {
    console.log('Delete button clicked:', article)

    if (!article) {
      console.log('No article selected')
      return
    }

    const confirmed = window.confirm('Are you sure you want to delete this article?')

    if (!confirmed) return

    try {
      await deleteArticleFromDatabase(article.id)

      setArticles(currentArticles => currentArticles.filter(a => a.id !== article.id))

      setArticle(null)
      setEditing(false)
      setWriting(false)

      console.log('Article deleted successfully')
    } catch (error) {
      console.error('Delete failed:', error)
      window.alert(`Could not delete article: ${error.message}`)
    }
  }
  return (
    <div className="Blog">
      <header>
        <span class="title">
          Bare Bones Blog <span class="bone">🦴</span>
        </span>

        <button className="dashboard-feature" onClick={() => setWriting(true)}>
          New Article
        </button>
        <button className="dashboard-feature" onClick={onSignOut}>
          Sign Out
        </button>
        <button
          className="dashboard-feature"
          onClick={() => {
            setWriting(false)
            setEditing(true)
          }}
          disabled={!article}
        >
          Edit Article
        </button>

        <button className="dashboard-feature" onClick={removeArticle} disabled={!article}>
          {' '}
          Delete Article{' '}
        </button>
      </header>
      <Nav articles={articles} setArticle={setArticle} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {writing ? (
        <ArticleEntry addArticle={addArticle} />
      ) : editing ? (
        <ArticleEdit article={article} saveArticle={saveArticle} cancelEdit={() => setEditing(false)} />
      ) : (
        <Article article={article} />
      )}{' '}
    </div>
  )
}
