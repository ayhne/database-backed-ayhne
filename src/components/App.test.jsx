import { test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// The real service talks to the Neon Data API over the network, so stand in a fake one.
vi.mock('../services/articleService', () => ({
  fetchArticles: async () => [],
  createArticle: async ({ title, body }) => ({ id: 1, title, body, date: new Date() })
}))

vi.mock('../services/authService', () => ({
  useAuthService: vi.fn(),
  getAccessToken: async () => 'test-token'
}))

test('renders the app component with the word Blog on it', async () => {
  render(<App />)
  await screen.findByText(/Blog/)
})
