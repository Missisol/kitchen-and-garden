import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useReserveCategoriesStore } from '@/stores/reserveCategories'
import type { ReserveCategory } from '@/@types/reserve'

const categories: ReserveCategory[] = [
  { id: 1, name: 'Крупы' },
  { id: 2, name: 'Овощи' },
]

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as unknown as Response
}

function stubFetch(response: Response | Promise<Response>) {
  const fetchMock = vi.fn().mockReturnValue(Promise.resolve(response))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function firstCall(fetchMock: ReturnType<typeof vi.fn>) {
  const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit | undefined]
  return { url, init }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

describe('getCategories', () => {
  it('loads categories into the store', async () => {
    const fetchMock = stubFetch(jsonResponse(categories))
    const store = useReserveCategoriesStore()

    await store.getCategories()

    expect(firstCall(fetchMock).url).toBe('/api/reserve_categories')
    expect(store.categories).toEqual(categories)
  })

  it('replaces the previous list', async () => {
    stubFetch(jsonResponse(categories))
    const store = useReserveCategoriesStore()
    store.categories = [{ id: 9, name: 'Старая' }]

    await store.getCategories()

    expect(store.categories).toEqual(categories)
  })
})

describe('createCategory', () => {
  it('posts the name and returns the created category', async () => {
    const created = { id: 3, name: 'Заморозка' }
    const fetchMock = stubFetch(jsonResponse(created, 201))
    const store = useReserveCategoriesStore()

    const result = await store.createCategory('Заморозка')

    const { url, init } = firstCall(fetchMock)
    expect(url).toBe('/api/reserve_categories')
    expect(init?.method).toBe('POST')
    expect(init?.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(init?.body).toBe(JSON.stringify({ name: 'Заморозка' }))
    expect(result).toEqual(created)
  })

  it('returns the server error on 409 duplicate', async () => {
    stubFetch(jsonResponse({ error: 'Category with this name already exists' }, 409))
    const store = useReserveCategoriesStore()

    const result = await store.createCategory('Крупы')

    expect(result).toEqual({ error: 'Category with this name already exists' })
  })

  it('falls back to a generic error when the payload has no error field', async () => {
    stubFetch(jsonResponse({}, 400))
    const store = useReserveCategoriesStore()

    const result = await store.createCategory('')

    expect(result).toEqual({ error: 'Failed to create category' })
  })

  it('returns undefined and does not throw when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const store = useReserveCategoriesStore()

    await expect(store.createCategory('Крупы')).resolves.toBeUndefined()
  })
})

describe('updateCategory', () => {
  it('uses PATCH and sends the new name', async () => {
    const updated = { id: 1, name: 'Крупы и бобовые' }
    const fetchMock = stubFetch(jsonResponse(updated))
    const store = useReserveCategoriesStore()

    const result = await store.updateCategory(1, 'Крупы и бобовые')

    const { url, init } = firstCall(fetchMock)
    expect(url).toBe('/api/reserve_category/1')
    expect(init?.method).toBe('PATCH')
    expect(init?.body).toBe(JSON.stringify({ name: 'Крупы и бобовые' }))
    expect(result).toEqual(updated)
  })

  it('returns the server error on 409 duplicate', async () => {
    stubFetch(jsonResponse({ error: 'Category with this name already exists' }, 409))
    const store = useReserveCategoriesStore()

    const result = await store.updateCategory(1, 'Овощи')

    expect(result).toEqual({ error: 'Category with this name already exists' })
  })

  it('returns the server error on 404', async () => {
    stubFetch(jsonResponse({ error: 'Not Found' }, 404))
    const store = useReserveCategoriesStore()

    const result = await store.updateCategory(99, 'Крупы')

    expect(result).toEqual({ error: 'Not Found' })
  })

  it('falls back to a generic error when the payload has no error field', async () => {
    stubFetch(jsonResponse({}, 500))
    const store = useReserveCategoriesStore()

    const result = await store.updateCategory(1, 'Крупы')

    expect(result).toEqual({ error: 'Failed to update category' })
  })

  it('returns undefined and does not throw when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const store = useReserveCategoriesStore()

    await expect(store.updateCategory(1, 'Крупы')).resolves.toBeUndefined()
  })
})

describe('deleteCategory', () => {
  // ReserveCategoryManage.vue сравнивает результат с 204 и только тогда
  // очищает форму и перезапрашивает список — контракт закрепляем тестом.
  it('uses PATCH with action=delete and returns the 204 status', async () => {
    const fetchMock = stubFetch(jsonResponse(null, 204))
    const store = useReserveCategoriesStore()

    const result = await store.deleteCategory(1)

    const { url, init } = firstCall(fetchMock)
    expect(url).toBe('/api/reserve_category/1')
    expect(init?.method).toBe('PATCH')
    expect(init?.body).toBe(JSON.stringify({ action: 'delete' }))
    expect(result).toBe(204)
  })

  it('returns the server error on 404', async () => {
    stubFetch(jsonResponse({ error: 'Not Found' }, 404))
    const store = useReserveCategoriesStore()

    const result = await store.deleteCategory(99)

    expect(result).toEqual({ error: 'Not Found' })
  })

  it('falls back to a generic error when the payload has no error field', async () => {
    stubFetch(jsonResponse({}, 500))
    const store = useReserveCategoriesStore()

    const result = await store.deleteCategory(1)

    expect(result).toEqual({ error: 'Failed to delete category' })
  })

  it('returns undefined and does not throw when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const store = useReserveCategoriesStore()

    await expect(store.deleteCategory(1)).resolves.toBeUndefined()
  })
})
