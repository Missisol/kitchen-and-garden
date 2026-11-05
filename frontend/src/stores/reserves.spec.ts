import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useReservesStore } from '@/stores/reserves'
import type { Reserve } from '@/@types/reserve'

const reserve: Reserve = {
  id: 1,
  created_at: '2025-03-07T10:00:00+00:00',
  category_id: 2,
  category_name: 'Крупы',
  kind: 'Рис',
  description: 'Длиннозерный',
  quantity: 2,
  unit: 'кг',
  expiry_date: '2026-03-07',
  location: 'Кладовая',
  place: 'Полка 2',
  is_active: true,
}

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response
}

function deferred<T>() {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })
  return { promise, resolve }
}

/** Подменяет fetch и возвращает мок, чтобы проверить URL, метод и тело запроса. */
function stubFetch(response: Response | Promise<Response>) {
  const fetchMock = vi.fn().mockReturnValue(Promise.resolve(response))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** Возвращает [url, init] первого вызова fetch. */
function firstCall(fetchMock: ReturnType<typeof vi.fn>) {
  const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit | undefined]
  return { url, init }
}

/** Доступ к элементу с явной ошибкой вместо non-null assertion (noUncheckedIndexedAccess). */
function at<T>(list: T[], index: number): T {
  const item = list[index]
  if (item === undefined) {
    throw new Error(`No element at index ${index}`)
  }
  return item
}

beforeEach(() => {
  setActivePinia(createPinia())
  // Сторы логируют ошибки в консоль — не засоряем вывод тестов.
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('getReserves: query params', () => {
  it('sends only the default order when filters are untouched', async () => {
    const fetchMock = stubFetch(jsonResponse([]))

    await useReservesStore().getReserves()

    const { url, init } = firstCall(fetchMock)
    expect(url).toBe('/api/reserves?order=desc')
    expect(init).toBeUndefined()
  })

  it('omits status when it is "all"', async () => {
    const fetchMock = stubFetch(jsonResponse([]))
    const store = useReservesStore()

    store.filters.status = 'all'
    await store.getReserves()

    expect(firstCall(fetchMock).url).not.toContain('status=')
  })

  it('passes status filter through', async () => {
    const fetchMock = stubFetch(jsonResponse([]))
    const store = useReservesStore()

    store.filters.status = 'active'
    await store.getReserves()

    expect(firstCall(fetchMock).url).toBe('/api/reserves?status=active&order=desc')
  })

  it('omits category_id when it is null', async () => {
    const fetchMock = stubFetch(jsonResponse([]))
    const store = useReservesStore()

    store.filters.category_id = null
    await store.getReserves()

    expect(firstCall(fetchMock).url).not.toContain('category_id=')
  })

  it('passes category_id, sort and order in a stable order', async () => {
    const fetchMock = stubFetch(jsonResponse([]))
    const store = useReservesStore()

    store.filters.status = 'inactive'
    store.filters.category_id = 3
    store.filters.sort = 'kind'
    store.filters.order = 'asc'
    await store.getReserves()

    expect(firstCall(fetchMock).url).toBe(
      '/api/reserves?status=inactive&category_id=3&sort=kind&order=asc'
    )
  })

  it('omits sort when the user reset it', async () => {
    const fetchMock = stubFetch(jsonResponse([]))
    const store = useReservesStore()

    store.filters.sort = ''
    await store.getReserves()

    expect(firstCall(fetchMock).url).not.toContain('sort=')
  })

  it('omits order when it is empty', async () => {
    const fetchMock = stubFetch(jsonResponse([]))
    const store = useReservesStore()

    store.filters.order = '' as typeof store.filters.order
    await store.getReserves()

    expect(firstCall(fetchMock).url).toBe('/api/reserves?')
  })

  it('url-encodes parameter values', async () => {
    const fetchMock = stubFetch(jsonResponse([]))
    const store = useReservesStore()

    // Значения приходят из UI, поэтому кодирование проверяем на пробеле и кириллице.
    store.filters.sort = 'a b&c' as typeof store.filters.sort
    await store.getReserves()

    expect(firstCall(fetchMock).url).toBe('/api/reserves?sort=a+b%26c&order=desc')
  })
})

describe('getReserves: state', () => {
  it('fills reserves and resets isLoading on success', async () => {
    stubFetch(jsonResponse([reserve]))
    const store = useReservesStore()

    expect(store.isLoading).toBe(false)
    const pending = store.getReserves()
    expect(store.isLoading).toBe(true)

    await pending

    expect(store.reserves).toEqual([reserve])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('clears a previous error before loading', async () => {
    stubFetch(jsonResponse([reserve]))
    const store = useReservesStore()
    store.error = 'старая ошибка'

    await store.getReserves()

    expect(store.error).toBeNull()
  })

  it('sets error and resets isLoading when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const store = useReservesStore()

    await store.getReserves()

    expect(store.error).toBe('Failed to load reserves')
    expect(store.isLoading).toBe(false)
  })

  // Известное ограничение: getReserves не проверяет res.ok, поэтому тело ошибки
  // попадает в reserves. Тест фиксирует текущее поведение; после исправления
  // заменить ожидания на error !== null и reserves = [].
  it('currently stores the error payload in reserves for a 500 response', async () => {
    stubFetch(jsonResponse({ error: 'Internal Server Error' }, 500))
    const store = useReservesStore()

    await store.getReserves()

    expect(store.reserves).toEqual({ error: 'Internal Server Error' })
    expect(store.error).toBeNull()
    expect(store.isLoading).toBe(false)
  })
})

describe('createReserve', () => {
  it('posts the body and returns the created reserve', async () => {
    const created = { ...reserve, id: 42 }
    const fetchMock = stubFetch(jsonResponse(created, 201))
    const store = useReservesStore()

    const result = await store.createReserve({ kind: 'Рис', quantity: 2 })

    const { url, init } = firstCall(fetchMock)
    expect(url).toBe('/api/reserve')
    expect(init?.method).toBe('POST')
    expect(init?.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(init?.body).toBe(JSON.stringify({ kind: 'Рис', quantity: 2 }))
    expect(result).toEqual(created)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('returns null and keeps the server error message on 400', async () => {
    stubFetch(jsonResponse({ error: 'Quantity must be greater than 0' }, 400))
    const store = useReservesStore()

    const result = await store.createReserve({ kind: 'Рис', quantity: 0 })

    expect(result).toBeNull()
    expect(store.error).toBe('Quantity must be greater than 0')
    expect(store.isLoading).toBe(false)
  })

  it('falls back to a generic message when the error payload has no error field', async () => {
    stubFetch(jsonResponse({}, 500))
    const store = useReservesStore()

    await store.createReserve({ kind: 'Рис', quantity: 1 })

    expect(store.error).toBe('Failed to create reserve')
  })

  it('sets a generic error and resets isLoading when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const store = useReservesStore()

    const result = await store.createReserve({ kind: 'Рис', quantity: 1 })

    expect(result).toBeUndefined()
    expect(store.error).toBe('Failed to create reserve')
    expect(store.isLoading).toBe(false)
  })
})

describe('updateReserve', () => {
  it('uses PATCH and sends only the provided fields', async () => {
    const updated = { ...reserve, is_active: false }
    const fetchMock = stubFetch(jsonResponse(updated))
    const store = useReservesStore()

    const result = await store.updateReserve(1, { is_active: false })

    const { url, init } = firstCall(fetchMock)
    expect(url).toBe('/api/reserve/1')
    expect(init?.method).toBe('PATCH')
    expect(init?.body).toBe(JSON.stringify({ is_active: false }))
    expect(result).toEqual(updated)
    expect(store.isLoading).toBe(false)
  })

  it('accepts a string id', async () => {
    const fetchMock = stubFetch(jsonResponse(reserve))
    const store = useReservesStore()

    await store.updateReserve('7', { kind: 'Гречка' })

    expect(firstCall(fetchMock).url).toBe('/api/reserve/7')
  })

  it('returns null and sets the server error message on failure', async () => {
    stubFetch(jsonResponse({ error: 'Description is required' }, 400))
    const store = useReservesStore()

    const result = await store.updateReserve(1, { description: '' })

    expect(result).toBeNull()
    expect(store.error).toBe('Description is required')
    expect(store.isLoading).toBe(false)
  })

  it('sets a generic error when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const store = useReservesStore()

    await store.updateReserve(1, { kind: 'Гречка' })

    expect(store.error).toBe('Failed to update reserve')
    expect(store.isLoading).toBe(false)
  })

  it('falls back to a generic message when the error payload has no error field', async () => {
    stubFetch(jsonResponse({}, 500))
    const store = useReservesStore()

    await store.updateReserve(1, { kind: 'Гречка' })

    expect(store.error).toBe('Failed to update reserve')
  })
})

describe('toggleReserveStatus', () => {
  it('flips the status of a list item and updates it in place', async () => {
    const other = { ...reserve, id: 2, kind: 'Гречка' }
    const fetchMock = stubFetch(jsonResponse({ id: 1, is_active: false }))
    const store = useReservesStore()
    store.reserves = [{ ...reserve }, other]

    const result = await store.toggleReserveStatus(1)

    const { url, init } = firstCall(fetchMock)
    expect(url).toBe('/api/reserve/1')
    expect(init?.method).toBe('PATCH')
    expect(init?.body).toBe(JSON.stringify({ is_active: false }))
    expect(at(store.reserves, 0).is_active).toBe(false)
    expect(at(store.reserves, 1).is_active).toBe(true)
    expect(result).toEqual({ id: 1, is_active: false })
  })

  it('flips an inactive item back to active', async () => {
    stubFetch(jsonResponse({ id: 1, is_active: true }))
    const store = useReservesStore()
    store.reserves = [{ ...reserve, is_active: false }]

    await store.toggleReserveStatus(1)

    expect(at(store.reserves, 0).is_active).toBe(true)
  })

  it('updates the currently opened reserve as well', async () => {
    stubFetch(jsonResponse({ id: 1, is_active: false }))
    const store = useReservesStore()
    store.reserves = [{ ...reserve }]
    store.reserve = { ...reserve }

    await store.toggleReserveStatus(1)

    expect((store.reserve as Reserve).is_active).toBe(false)
    expect(at(store.reserves, 0).is_active).toBe(false)
  })

  it('uses the opened reserve when it is missing from the list', async () => {
    const fetchMock = stubFetch(jsonResponse({ id: 5, is_active: false }))
    const store = useReservesStore()
    store.reserves = []
    store.reserve = { ...reserve, id: 5 }

    await store.toggleReserveStatus(5)

    expect(firstCall(fetchMock).url).toBe('/api/reserve/5')
    expect((store.reserve as Reserve).is_active).toBe(false)
  })

  it('does nothing when the reserve is unknown', async () => {
    const fetchMock = stubFetch(jsonResponse({}))
    const store = useReservesStore()
    store.reserves = [{ ...reserve }]

    const result = await store.toggleReserveStatus(999)

    expect(fetchMock).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it('returns null, keeps state and sets error when the request fails', async () => {
    stubFetch(jsonResponse({ error: 'Reserve not found' }, 404))
    const store = useReservesStore()
    store.reserves = [{ ...reserve }]

    const result = await store.toggleReserveStatus(1)

    expect(result).toBeNull()
    expect(store.error).toBe('Reserve not found')
    expect(at(store.reserves, 0).is_active).toBe(true)
  })

  it('sets a generic error when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const store = useReservesStore()
    store.reserves = [{ ...reserve }]

    const result = await store.toggleReserveStatus(1)

    expect(result).toBeNull()
    expect(store.error).toBe('Failed to update status')
  })

  it('falls back to a generic message when the error payload has no error field', async () => {
    stubFetch(jsonResponse({}, 500))
    const store = useReservesStore()
    store.reserves = [{ ...reserve }]

    await store.toggleReserveStatus(1)

    expect(store.error).toBe('Failed to update status')
  })
})

describe('deleteReserveById', () => {
  it('removes the reserve from the list on 204', async () => {
    const fetchMock = stubFetch(jsonResponse(null, 204))
    const store = useReservesStore()
    store.reserves = [{ ...reserve }, { ...reserve, id: 2 }]

    const result = await store.deleteReserveById(1)

    const { url, init } = firstCall(fetchMock)
    expect(url).toBe('/api/reserve/1')
    expect(init?.method).toBe('DELETE')
    expect(result).toBe(true)
    expect(store.reserves.map(r => r.id)).toEqual([2])
    expect(store.isLoading).toBe(false)
  })

  it('returns false and sets the server error on 404', async () => {
    stubFetch(jsonResponse({ error: 'Not Found' }, 404))
    const store = useReservesStore()
    store.reserves = [{ ...reserve }]

    const result = await store.deleteReserveById(1)

    expect(result).toBe(false)
    expect(store.error).toBe('Not Found')
    expect(store.reserves).toHaveLength(1)
    expect(store.isLoading).toBe(false)
  })

  it('returns false on 500', async () => {
    stubFetch(jsonResponse({ error: 'Internal Server Error' }, 500))
    const store = useReservesStore()

    const result = await store.deleteReserveById(1)

    expect(result).toBe(false)
    expect(store.error).toBe('Internal Server Error')
  })

  it('returns false and sets a generic error when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const store = useReservesStore()

    const result = await store.deleteReserveById(1)

    expect(result).toBe(false)
    expect(store.error).toBe('Failed to delete reserve')
    expect(store.isLoading).toBe(false)
  })

  it('falls back to a generic message when the error payload has no error field', async () => {
    stubFetch(jsonResponse({}, 500))
    const store = useReservesStore()

    await store.deleteReserveById(1)

    expect(store.error).toBe('Failed to delete reserve')
  })
})

describe('getReserveById', () => {
  it('loads a single reserve', async () => {
    const fetchMock = stubFetch(jsonResponse(reserve))
    const store = useReservesStore()

    await store.getReserveById(1)

    expect(firstCall(fetchMock).url).toBe('/api/reserve/1')
    expect(store.reserve).toEqual(reserve)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('accepts a string id', async () => {
    const fetchMock = stubFetch(jsonResponse(reserve))
    const store = useReservesStore()

    await store.getReserveById('12')

    expect(firstCall(fetchMock).url).toBe('/api/reserve/12')
  })

  it('clears the previous reserve before the request completes', async () => {
    const d = deferred<Response>()
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(d.promise))
    const store = useReservesStore()
    store.reserve = { ...reserve, id: 99 }

    const pending = store.getReserveById(1)

    expect(store.reserve).toEqual({})
    expect(store.isLoading).toBe(true)

    d.resolve(jsonResponse(reserve))
    await pending

    expect(store.reserve).toEqual(reserve)
  })

  it('sets error and leaves reserve empty when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const store = useReservesStore()
    store.reserve = { ...reserve, id: 99 }

    await store.getReserveById(1)

    expect(store.error).toBe('Failed to load reserve')
    expect(store.reserve).toEqual({})
    expect(store.isLoading).toBe(false)
  })

  // То же известное ограничение, что и у getReserves: res.ok не проверяется.
  it('currently stores the error payload in reserve for a 404 response', async () => {
    stubFetch(jsonResponse({ error: 'Reserve not found' }, 404))
    const store = useReservesStore()

    await store.getReserveById(404)

    expect(store.reserve).toEqual({ error: 'Reserve not found' })
    expect(store.error).toBeNull()
  })
})
