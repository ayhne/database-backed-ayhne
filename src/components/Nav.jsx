export default function Nav({ articles, setArticle, searchTerm, setSearchTerm }) {
  const filteredArticles = articles.filter(
    a =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.body.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <nav>
      <input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {!articles.length ? (
        <p>No articles</p>
      ) : filteredArticles.length === 0 ? (
        <p>No matching articles</p>
      ) : (
        filteredArticles.map(a => (
          <p key={a.id} onClick={() => setArticle(a)}>
            {a.title}
          </p>
        ))
      )}
    </nav>
  )
}
