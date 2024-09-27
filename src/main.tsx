import React from 'react'
import './index.css'
import { Toaster } from 'react-hot-toast'
import { createRoot } from 'react-dom/client'
import App from './app'

const container = document.getElementById('root')
if (!container) throw new Error('No root element')
const root = createRoot(container)

root.render(
  <>
    <App />
    <Toaster />
  </>
)
