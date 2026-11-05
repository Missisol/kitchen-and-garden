import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ReserveCategoryManage from '@/components/reserves/ReserveCategoryManage.vue'
import { useReserveCategoriesStore } from '@/stores/reserveCategories'
import type { ReserveCategory } from '@/@types/reserve'

const categories: ReserveCategory[] = [
  { id: 1, name: 'Крупы' },
  { id: 3, name: 'Овощи' },
]

function mountManage() {
  const pinia = createTestingPinia({
    stubActions: true,
    createSpy: vi.fn,
    initialState: {
      reserveCategories: { categories },
    },
  })

  const wrapper = mount(ReserveCategoryManage, {
    global: {
      plugins: [pinia],
      stubs: { teleport: true },
    },
  })

  return {
    wrapper,
    store: useReserveCategoriesStore(pinia),
  }
}

async function selectCategory(wrapper: ReturnType<typeof mountManage>['wrapper'], id: number) {
  const select = wrapper.find('select')
  if (!select) throw new Error('select not found')
  await select.setValue(String(id))
}

function updateButton(wrapper: ReturnType<typeof mountManage>['wrapper']) {
  const btn = wrapper.findAll('.form__buttons button')[1]
  if (!btn) throw new Error('update button not found')
  return btn
}

function deleteButton(wrapper: ReturnType<typeof mountManage>['wrapper']) {
  const btn = wrapper.findAll('.form__buttons button')[0]
  if (!btn) throw new Error('delete button not found')
  return btn
}

function el<T extends HTMLElement>(wrapper: ReturnType<typeof mountManage>['wrapper'], selector: string): T {
  const found = wrapper.find(selector)
  if (!found.element) throw new Error(`Element not found: ${selector}`)
  return found.element as T
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('ReserveCategoryManage: disabled-состояния', () => {
  it('обе кнопки disabled без выбранной категории', () => {
    const { wrapper } = mountManage()

    expect(deleteButton(wrapper).attributes('disabled')).toBeDefined()
    expect(updateButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('кнопка удаления enabled после выбора категории', async () => {
    const { wrapper } = mountManage()

    await selectCategory(wrapper, 1)

    expect(deleteButton(wrapper).attributes('disabled')).toBeUndefined()
  })

  it('кнопка обновления disabled, если имя не изменилось', async () => {
    const { wrapper } = mountManage()

    await selectCategory(wrapper, 1)

    // categoryName заполняется из watch — имя совпадает с выбранным.
    expect(updateButton(wrapper).attributes('disabled')).toBeDefined()
  })

  it('кнопка обновления enabled после изменения имени', async () => {
    const { wrapper } = mountManage()

    await selectCategory(wrapper, 1)
    await wrapper.find('#reserve_category_manage_name').setValue('Крупы и бобовые')

    expect(updateButton(wrapper).attributes('disabled')).toBeUndefined()
  })
})

describe('ReserveCategoryManage: выбор категории', () => {
  it('подставляет имя выбранной категории в поле', async () => {
    const { wrapper } = mountManage()

    await selectCategory(wrapper, 3)

    expect(el<HTMLInputElement>(wrapper, '#reserve_category_manage_name').value).toBe('Овощи')
  })

  it('поле disabled без выбранной категории', () => {
    const { wrapper } = mountManage()

    expect(wrapper.find('#reserve_category_manage_name').attributes('disabled')).toBeDefined()
  })

  it('поле enabled после выбора категории', async () => {
    const { wrapper } = mountManage()

    await selectCategory(wrapper, 1)

    expect(wrapper.find('#reserve_category_manage_name').attributes('disabled')).toBeUndefined()
  })
})

describe('ReserveCategoryManage: обновление', () => {
  it('вызывает updateCategory с id и новым именем', async () => {
    const { wrapper, store } = mountManage()
    ;(store.updateCategory as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 1, name: 'Крупы и бобовые' })

    await selectCategory(wrapper, 1)
    await wrapper.find('#reserve_category_manage_name').setValue('Крупы и бобовые')
    await updateButton(wrapper).trigger('click')

    expect(store.updateCategory).toHaveBeenCalledWith(1, 'Крупы и бобовые')
  })

  it('не вызывает updateCategory, если имя не изменилось', async () => {
    const { wrapper, store } = mountManage()

    await selectCategory(wrapper, 1)
    await updateButton(wrapper).trigger('click')

    expect(store.updateCategory).not.toHaveBeenCalled()
  })

  it('не вызывает updateCategory, если категория не выбрана', async () => {
    const { wrapper, store } = mountManage()

    await updateButton(wrapper).trigger('click')

    expect(store.updateCategory).not.toHaveBeenCalled()
  })

  it('очищает поля и перезапрашивает список после успешного обновления', async () => {
    const { wrapper, store } = mountManage()
    ;(store.updateCategory as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 1, name: 'Крупы и бобовые' })

    await selectCategory(wrapper, 1)
    await wrapper.find('#reserve_category_manage_name').setValue('Крупы и бобовые')
    await updateButton(wrapper).trigger('click')
    await wrapper.vm.$nextTick()

    expect((wrapper.find('#reserve_category_manage_name').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('')
    expect(store.getCategories).toHaveBeenCalledTimes(1)
  })

  it('не очищает поля при ошибке обновления', async () => {
    const { wrapper, store } = mountManage()
    ;(store.updateCategory as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Conflict' })

    await selectCategory(wrapper, 1)
    await wrapper.find('#reserve_category_manage_name').setValue('Крупы и бобовые')
    await updateButton(wrapper).trigger('click')
    await wrapper.vm.$nextTick()

    expect((wrapper.find('#reserve_category_manage_name').element as HTMLInputElement).value).toBe('Крупы и бобовые')
    expect(store.getCategories).not.toHaveBeenCalled()
  })
})

describe('ReserveCategoryManage: удаление', () => {
  it('открывает диалог с именем категории в тексте', async () => {
    const { wrapper } = mountManage()

    await selectCategory(wrapper, 3)
    await deleteButton(wrapper).trigger('click')

    expect(wrapper.find('.dialog__message').text()).toContain('Овощи')
  })

  it('не открывает диалог без выбранной категории', async () => {
    const { wrapper } = mountManage()

    await deleteButton(wrapper).trigger('click')

    expect(wrapper.find('.dialog__message').exists()).toBe(false)
  })

  it('вызывает deleteCategory с id после подтверждения', async () => {
    const { wrapper, store } = mountManage()
    ;(store.deleteCategory as ReturnType<typeof vi.fn>).mockResolvedValue(204)

    await selectCategory(wrapper, 1)
    await deleteButton(wrapper).trigger('click')
    await wrapper.find('.dialog__button--confirm').trigger('click')

    expect(store.deleteCategory).toHaveBeenCalledWith(1)
  })

  it('не вызывает deleteCategory при отмене', async () => {
    const { wrapper, store } = mountManage()

    await selectCategory(wrapper, 1)
    await deleteButton(wrapper).trigger('click')
    await wrapper.find('.dialog__button--cancel').trigger('click')

    expect(store.deleteCategory).not.toHaveBeenCalled()
  })

  it('очищает поля и перезапрашивает список после успешного удаления', async () => {
    const { wrapper, store } = mountManage()
    ;(store.deleteCategory as ReturnType<typeof vi.fn>).mockResolvedValue(204)

    await selectCategory(wrapper, 1)
    await deleteButton(wrapper).trigger('click')
    await wrapper.find('.dialog__button--confirm').trigger('click')
    await wrapper.vm.$nextTick()

    expect((wrapper.find('#reserve_category_manage_name').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('')
    expect(store.getCategories).toHaveBeenCalledTimes(1)
  })

  it('не очищает поля при ошибке удаления', async () => {
    const { wrapper, store } = mountManage()
    ;(store.deleteCategory as ReturnType<typeof vi.fn>).mockResolvedValue({ error: 'Not Found' })

    await selectCategory(wrapper, 1)
    await deleteButton(wrapper).trigger('click')
    await wrapper.find('.dialog__button--confirm').trigger('click')
    await wrapper.vm.$nextTick()

    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('1')
    expect(store.getCategories).not.toHaveBeenCalled()
  })
})
