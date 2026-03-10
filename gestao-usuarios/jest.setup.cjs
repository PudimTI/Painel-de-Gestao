// Setup global para Jest (ambiente de testes)
require('@testing-library/jest-dom')

// Polyfill de TextEncoder/TextDecoder para libs que dependem disso (ex.: react-router)
try {
  const { TextEncoder, TextDecoder } = require('util')

  if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder
  }

  if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder
  }
} catch {
  // Em ambientes onde 'util' não existe, apenas ignoramos
}

