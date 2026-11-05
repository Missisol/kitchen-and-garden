import { afterEach, beforeEach, vi } from 'vitest'

// Сторы пишут в localStorage (тема в CommonHeader), поэтому состояние
// должно быть чистым в начале каждого теста.
beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = ''

  // Тесты не должны ходить в сеть: каждый тест сам подменяет fetch.
  // Если подмены нет — падаем явной ошибкой, а не реальным запросом.
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('fetch is not mocked'))))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.clearAllMocks()
  vi.useRealTimers()
})
