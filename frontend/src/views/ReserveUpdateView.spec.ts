import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ReserveUpdateView from '@/views/ReserveUpdateView.vue'
import { useReservesStore } from '@/stores/reserves'
import { useReserveCategoriesStore } from '@/stores/reserveCategories'
import type { Reserve } from '@/@types/reserve'
import { resetRouterMock, routeMock, routerMock, RouterLink } from '@/test/mocks/vue-router'

vi.mock('vue-router', () => import('@/test/mocks/vue-router'))

const reserve: Reserve = {
  id: 7,
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

function mountView(state: {
  reserve?: Record<string, unknown>
  error?: string | null
} = {}) {
  routeMock.params = { id: String(reserve.id) }

  const pinia = createTestingPinia({
    stubActions: true,
    createSpy: vi.fn,
    initialState: {
      reserves: {
        reserve: state.reserve ?? reserve,
        error: state.error ?? null,
      },
      reserveCategories: {
        categories: [{ id: 2, name: 'Крупы' }],
      },
    },
  })

  const wrapper = mount(ReserveUpdateView, {
    global: {
      plugins: [pinia],
      components: { RouterLink },
    },
  })

  return {
    wrapper,
    reservesStore: useReservesStore(pinia),
    categoriesStore: useReserveCategoriesStore(pinia),
  }
}

beforeEach(() => {
  resetRouterMock()
})

describe('ReserveUpdateView: загрузка', () => {
  it('запрашивает запись по id из маршрута', () => {
    const { reservesStore } = mountView()

    expect(reservesStore.getReserveById).toHaveBeenCalledWith(7)
  })

  it('показывает форму, когда запись найдена', () => {
    const { wrapper } = mountView()

    expect(wrapper.findComponent({ name: 'ReserveForm' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'CommonError' }).exists()).toBe(false)
  })
})

describe('ReserveUpdateView: отправка формы', () => {
  it('отправляет только изменённые поля', async () => {
    const { wrapper, reservesStore } = mountView()
    ;(reservesStore.updateReserve as ReturnType<typeof vi.fn>).mockResolvedValue({ id: reserve.id })

    // Находим input по id и меняем только kind.
    await wrapper.find('#kind').setValue('Гречка')

    // submit формы → update() → buildBody → updateReserve
    await wrapper.find('form').trigger('submit')

    expect(reservesStore.updateReserve).toHaveBeenCalledTimes(1)

    const calls = (reservesStore.updateReserve as ReturnType<typeof vi.fn>).mock.calls
    expect(calls).toHaveLength(1)
    const [id, body] = calls[0]!
    expect(id).toBe(7)
    // В body должен быть только kind, остальные поля не изменились.
    expect(body).toEqual({ kind: 'Гречка' })
  })

  it('не вызывает updateReserve при пустом diff', async () => {
    const { wrapper, reservesStore } = mountView()

    // submit без изменений — diff пустой.
    await wrapper.find('form').trigger('submit')

    expect(reservesStore.updateReserve).not.toHaveBeenCalled()
  })

  it('редиректит на /reserves после успешного обновления', async () => {
    const { wrapper, reservesStore } = mountView()
    ;(reservesStore.updateReserve as ReturnType<typeof vi.fn>).mockResolvedValue({ id: reserve.id })

    await wrapper.find('#kind').setValue('Гречка')
    await wrapper.find('form').trigger('submit')

    expect(routerMock.push).toHaveBeenCalledWith({ path: '/reserves' })
  })

  it('не редиректит при ошибке обновления', async () => {
    const { wrapper, reservesStore } = mountView()
    ;(reservesStore.updateReserve as ReturnType<typeof vi.fn>).mockResolvedValue(null)

    await wrapper.find('#kind').setValue('Гречка')
    await wrapper.find('form').trigger('submit')

    expect(routerMock.push).not.toHaveBeenCalledWith({ path: '/reserves' })
  })
})

describe('ReserveUpdateView: отсутствие записи', () => {
  it('показывает CommonError, когда reserve пустой', () => {
    const { wrapper } = mountView({ reserve: {} })

    expect(wrapper.findComponent({ name: 'CommonError' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ReserveForm' }).exists()).toBe(false)
  })

  it('показывает CommonError при ошибке загрузки', () => {
    const { wrapper } = mountView({ reserve: {}, error: 'Failed to load reserve' })

    expect(wrapper.findComponent({ name: 'CommonError' }).exists()).toBe(true)
  })

  it('CommonError получает текст ошибки из стора', () => {
    const { wrapper } = mountView({ reserve: {}, error: 'Failed to load reserve' })

    const errorProp = wrapper.findComponent({ name: 'CommonError' }).props('error')
    expect(errorProp).toBe('Failed to load reserve')
  })

  it('CommonError получает error из объекта reserve, если он там есть', () => {
    const { wrapper } = mountView({ reserve: { error: 'Reserve not found' } })

    const errorProp = wrapper.findComponent({ name: 'CommonError' }).props('error')
    expect(errorProp).toBe('Reserve not found')
  })
})
