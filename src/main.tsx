import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'urql'

import App from './app/App.tsx'
import { client } from './graphql.ts'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider value={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
