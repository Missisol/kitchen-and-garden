import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ReservesView from '@/views/ReservesView.vue'
import { useReservesStore } from '@/stores/reserves'
import { useReserveCategoriesStore } from '@/stores/reserveCategories'
import type { Reserve, ReserveCategory } from '@/@types/reserve'
import { resetRouterMock, RouterLink } from '@/test/mocks/vue-router'

vi.mock('vue-router', () => import('@/test/mocks/vue-router'))

const categories: ReserveCategory[] = [
  { id: 2, name: 'Крупы' },
  { id: 4, name: 'Овощи' },
]

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

function mountView(state: {
  reserves?: Record<string, unknown>
  categories?: ReserveCategory[]
} = {}) {
  const pinia = createTestingPinia({
    stubActions: true,
    createSpy: vi.fn,
    initialState: {
      reserves: {
        reserves: [],
        reserve: {},
        filters: { status: 'all', category_id: null, sort: '', order: 'desc' },
        isLoading: false,
        error: null,
        ...state.reserves,
      },
      reserveCategories: {
        categories: state.categories ?? categories,
      },
    },
  })

  const wrapper = mount(ReservesView, {
    global: {
      plugins: [pinia],
      stubs: { teleport: true },
      components: { RouterLink },
    },
  })

  return {
    wrapper,
    reservesStore: useReservesStore(pinia),
    categoriesStore: useReserveCategoriesStore(pinia),
  }
}

type ViewWrapper = ReturnType<typeof mountView>['wrapper']

function at<T>(list: T[], index: number): T {
  const item = list[index]
  if (item === undefined) {
    throw new Error(`No element at index ${index}`)
  }
  return item
}

/** Заголовки таблицы, по которым можно сортировать: категория, вид, количество, локация, место. */
function sortableHeaders(wrapper: ViewWrapper) {
  return wrapper.findAll('th.sortable')
}

beforeEach(() => {
  resetRouterMock()
})

describe('ReservesView: загрузка данных', () => {
  it('запрашивает запасы и категории при монтировании', () => {
    const { reservesStore, categoriesStore } = mountView()

    expect(reservesStore.getReserves).toHaveBeenCalledTimes(1)
    expect(categoriesStore.getCategories).toHaveBeenCalledTimes(1)
  })
})

describe('ReservesView: сортировка', () => {
  it('первый клик — asc, второй — desc, третий — сброс', async () => {
    const { wrapper, reservesStore } = mountView({
      reserves: { reserves: [reserve] },
    })
    const headers = sortableHeaders(wrapper)

    await at(headers, 1).trigger('click')
    expect(reservesStore.filters.sort).toBe('kind')
    expect(reservesStore.filters.order).toBe('asc')
    expect(at(headers, 1).text()).toContain('↑')

    await at(headers, 1).trigger('click')
    expect(reservesStore.filters.sort).toBe('kind')
    expect(reservesStore.filters.order).toBe('desc')
    expect(at(headers, 1).text()).toContain('↓')

    // Сброс: sort='' (buildQueryParams его не отправляет, backend берёт created_at),
    // order при этом остаётся 'asc' — так реализовано в компоненте.
    await at(headers, 1).trigger('click')
    expect(reservesStore.filters.sort).toBe('')
    expect(reservesStore.filters.order).toBe('asc')
    expect(at(headers, 1).text()).not.toContain('↑')
    expect(at(headers, 1).text()).not.toContain('↓')
  })

  it('каждый клик перезапрашивает список', async () => {
    const { wrapper, reservesStore } = mountView({
      reserves: { reserves: [reserve] },
    })
    const headers = sortableHeaders(wrapper)

    await at(headers, 1).trigger('click')
    await at(headers, 1).trigger('click')
    await at(headers, 1).trigger('click')

    // 1 запрос при монтировании + 3 клика.
    expect(reservesStore.getReserves).toHaveBeenCalledTimes(4)
  })

  it('переключение на другое поле начинает с asc', async () => {
    const { wrapper, reservesStore } = mountView({
      reserves: { reserves: [reserve] },
    })
    const headers = sortableHeaders(wrapper)

    await at(headers, 1).trigger('click')
    await at(headers, 1).trigger('click')
    await at(headers, 2).trigger('click')

    expect(reservesStore.filters.sort).toBe('quantity')
    expect(reservesStore.filters.order).toBe('asc')
  })
})

describe('ReservesView: фильтр по статусу', () => {
  it('выставляет status и перезапрашивает список', async () => {
    const { wrapper, reservesStore } = mountView()
    const buttons = wrapper.findAll('.filter-btn')

    await at(buttons, 1).trigger('click')

    expect(reservesStore.filters.status).toBe('active')
    expect(reservesStore.getReserves).toHaveBeenCalledTimes(2)
    expect(at(buttons, 1).classes()).toContain('filter-btn--active')
  })

  it('возвращает status=all по кнопке «Все»', async () => {
    const { wrapper, reservesStore } = mountView()
    const buttons = wrapper.findAll('.filter-btn')

    await at(buttons, 2).trigger('click')
    expect(reservesStore.filters.status).toBe('inactive')

    await at(buttons, 0).trigger('click')
    expect(reservesStore.filters.status).toBe('all')
  })
})

describe('ReservesView: переключение статуса записи', () => {
  it('вызывает toggleReserveStatus с id записи', async () => {
    const { wrapper, reservesStore } = mountView({
      reserves: { reserves: [reserve] },
    })

    await wrapper.find('.action-btn--text').trigger('click')

    expect(reservesStore.toggleReserveStatus).toHaveBeenCalledWith(1)
  })

  // Текущее поведение: список не перезапрашивается, стор обновляет запись на месте.
  it('не перезапрашивает список после переключения', async () => {
    const { wrapper, reservesStore } = mountView({
      reserves: { reserves: [reserve] },
    })

    await wrapper.find('.action-btn--text').trigger('click')

    expect(reservesStore.getReserves).toHaveBeenCalledTimes(1)
  })
})

describe('ReservesView: состояния', () => {
  it('показывает загрузку для пустого списка', () => {
    const { wrapper } = mountView({
      reserves: { reserves: [], isLoading: true },
    })

    expect(wrapper.find('.empty').text()).toBe('Загрузка...')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('показывает ошибку', () => {
    const { wrapper } = mountView({
      reserves: { reserves: [], error: 'Не удалось загрузить запасы' },
    })

    expect(wrapper.find('.empty.error').text()).toBe('Не удалось загрузить запасы')
  })

  it('показывает пустое состояние со ссылкой на создание', () => {
    const { wrapper } = mountView()

    const link = wrapper.find('.empty__link')
    expect(link.text()).toBe('Добавить первый')
    expect(link.attributes('href')).toBe('/reserves/create')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('показывает таблицу с данными', () => {
    const { wrapper } = mountView({
      reserves: { reserves: [reserve] },
    })

    const row = wrapper.find('tbody tr')
    const cells = row.findAll('td').map(cell => cell.text())

    expect(cells).toEqual([
      '07.03.2025',
      'Крупы',
      'Рис',
      'Длиннозерный',
      '2 кг',
      '07.03.2026',
      'Кладовая',
      'Полка 2',
      'Активна',
      'Использовано',
    ])
  })

  it('показывает прочерки для пустых полей', () => {
    const { wrapper } = mountView({
      reserves: {
        reserves: [
          {
            ...reserve,
            category_id: null,
            category_name: '',
            description: '',
            location: null,
            place: null,
            is_active: false,
          },
        ],
      },
    })

    const cells = wrapper.find('tbody tr').findAll('td').map(cell => cell.text())

    expect(cells[1]).toBe('—')
    expect(cells[3]).toBe('—')
    expect(cells[6]).toBe('—')
    expect(cells[7]).toBe('—')
    expect(cells[8]).toBe('Неактивна')
    expect(cells[9]).toBe('Вернуть')
  })
})

describe('ReservesView: фильтр по категории', () => {
  async function openDropdown(wrapper: ViewWrapper) {
    // Первый TransitionDropdown — фильтр по категории, второй — управление категориями.
    await at(wrapper.findAll('.transition-button'), 0).trigger('click')
  }

  it('выставляет category_id и показывает выбранную категорию', async () => {
    const { wrapper, reservesStore } = mountView()

    expect(at(wrapper.findAll('.transition-button'), 0).text()).toContain('Все')

    await openDropdown(wrapper)
    const items = wrapper.findAll('.category-dropdown__item')
    expect(items).toHaveLength(3)
    await at(items, 1).trigger('click')

    expect(reservesStore.filters.category_id).toBe(2)
    expect(reservesStore.getReserves).toHaveBeenCalledTimes(2)
    expect(wrapper.find('.category-dropdown').exists()).toBe(false)
    expect(at(wrapper.findAll('.transition-button'), 0).text()).toContain('Крупы')
  })

  it('сбрасывает фильтр по пункту «Все»', async () => {
    const { wrapper, reservesStore } = mountView()

    await openDropdown(wrapper)
    await at(wrapper.findAll('.category-dropdown__item'), 1).trigger('click')
    await openDropdown(wrapper)
    await at(wrapper.findAll('.category-dropdown__item'), 0).trigger('click')

    expect(reservesStore.filters.category_id).toBeNull()
    expect(at(wrapper.findAll('.transition-button'), 0).text()).toContain('Все')
  })

  it('подсвечивает активный пункт', async () => {
    const { wrapper } = mountView({
      reserves: { filters: { status: 'all', category_id: 4, sort: '', order: 'desc' } },
    })

    await openDropdown(wrapper)

    const items = wrapper.findAll('.category-dropdown__item')
    expect(at(items, 2).classes()).toContain('category-dropdown__item--active')
    expect(at(items, 0).classes()).not.toContain('category-dropdown__item--active')
  })
})

describe('ReservesView: удаление', () => {
  it('открывает диалог и удаляет запись после подтверждения', async () => {
    const { wrapper, reservesStore } = mountView({
      reserves: { reserves: [reserve] },
    })

    expect(wrapper.find('.dialog__message').exists()).toBe(false)

    await wrapper.find('.action-btn--danger').trigger('click')

    expect(wrapper.find('.dialog__message').text()).toContain('удалить эту запись')

    await wrapper.find('.dialog__button--confirm').trigger('click')

    expect(reservesStore.deleteReserveById).toHaveBeenCalledWith(1)
    expect(wrapper.find('.dialog__message').exists()).toBe(false)
  })

  it('не удаляет запись при отмене', async () => {
    const { wrapper, reservesStore } = mountView({
      reserves: { reserves: [reserve] },
    })

    await wrapper.find('.action-btn--danger').trigger('click')
    await wrapper.find('.dialog__button--cancel').trigger('click')

    expect(reservesStore.deleteReserveById).not.toHaveBeenCalled()
    expect(wrapper.find('.dialog__message').exists()).toBe(false)
  })
})

describe('ReservesView: размонтирование', () => {
  it('сбрасывает фильтры и сортировку', async () => {
    const { wrapper, reservesStore } = mountView({
      reserves: { reserves: [reserve] },
    })

    await at(wrapper.findAll('.filter-btn'), 1).trigger('click')
    await at(wrapper.findAll('.transition-button'), 0).trigger('click')
    await at(wrapper.findAll('.category-dropdown__item'), 1).trigger('click')
    await at(sortableHeaders(wrapper), 1).trigger('click')

    expect(reservesStore.filters.status).toBe('active')
    expect(reservesStore.filters.category_id).toBe(2)
    expect(reservesStore.filters.sort).toBe('kind')

    wrapper.unmount()

    expect(reservesStore.filters).toEqual({
      status: 'all',
      category_id: null,
      sort: '',
      order: 'desc',
    })
  })
})
