import { reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ReserveForm from '@/components/reserves/ReserveForm.vue'
import CategorySelect from '@/components/category/CategorySelect.vue'
import type { Reserve, ReserveCategory } from '@/@types/reserve'
import { resetRouterMock, routerMock } from '@/test/mocks/vue-router'

vi.mock('vue-router', () => import('@/test/mocks/vue-router'))

const categories: ReserveCategory[] = [
  { id: 1, name: 'Крупы' },
  { id: 3, name: 'Овощи' },
]

function validModel(): Partial<Reserve> {
  return {
    kind: 'Рис',
    description: 'Длиннозерный',
    quantity: 2,
    unit: 'кг',
    is_active: true,
  }
}

/** Модель с переопределением полей; quantity в форме может быть null. */
function modelWith(overrides: Record<string, unknown>): Partial<Reserve> {
  return { ...validModel(), ...overrides } as Partial<Reserve>
}

function mountForm(model: Partial<Reserve>, createdAt?: string) {
  return mount(ReserveForm, {
    props: {
      model,
      categories,
      createdAt,
    },
  })
}

type FormWrapper = ReturnType<typeof mountForm>

/** Submit идёт через форму, потому что кнопка — CommonButton с type=submit. */
async function submit(wrapper: FormWrapper) {
  await wrapper.find('form').trigger('submit')
}

function errorTexts(wrapper: FormWrapper): string[] {
  return wrapper.findAll('.label__error').map(el => el.text())
}

function at<T>(list: T[], index: number): T {
  const item = list[index]
  if (item === undefined) {
    throw new Error(`No element at index ${index}`)
  }
  return item
}

beforeEach(() => {
  resetRouterMock()
})

describe('ReserveForm: валидация', () => {
  it('не показывает ошибки до первого submit', () => {
    const wrapper = mountForm(reactive({ kind: '', description: '', quantity: 0 }))

    expect(errorTexts(wrapper)).toEqual([])
  })

  it('показывает ошибки после submit и не эмитит sendForm', async () => {
    const wrapper = mountForm(reactive({ kind: '', description: '', quantity: 0 }))

    await submit(wrapper)

    expect(errorTexts(wrapper)).toEqual([
      'Укажите вид запаса',
      'Количество должно быть больше 0',
    ])
    expect(wrapper.emitted('sendForm')).toBeUndefined()
  })

  it('считает вид из пробелов пустым', async () => {
    const wrapper = mountForm(reactive(modelWith({ kind: '   ' })))

    await submit(wrapper)

    expect(errorTexts(wrapper)).toEqual(['Укажите вид запаса'])
    expect(wrapper.emitted('sendForm')).toBeUndefined()
  })

  // Текущее поведение: описание в форме не валидируется, хотя backend
  // требует его в _validate_reserve и отвечает 400 без привязки к полю.
  it('не валидирует описание, даже если оно пустое или из пробелов', async () => {
    const wrapper = mountForm(reactive(modelWith({ description: '   ' })))

    await submit(wrapper)

    expect(errorTexts(wrapper)).toEqual([])
    expect(wrapper.emitted('sendForm')).toHaveLength(1)
  })

  it('отклоняет нулевое количество', async () => {
    const wrapper = mountForm(reactive(modelWith({ quantity: 0 })))

    await submit(wrapper)

    expect(errorTexts(wrapper)).toEqual(['Количество должно быть больше 0'])
    expect(wrapper.emitted('sendForm')).toBeUndefined()
  })

  it('отклоняет отрицательное количество', async () => {
    const wrapper = mountForm(reactive(modelWith({ quantity: -5 })))

    await submit(wrapper)

    expect(errorTexts(wrapper)).toEqual(['Количество должно быть больше 0'])
    expect(wrapper.emitted('sendForm')).toBeUndefined()
  })

  it('отклоняет отсутствующее количество', async () => {
    const wrapper = mountForm(reactive(modelWith({ quantity: null })))

    await submit(wrapper)

    expect(errorTexts(wrapper)).toEqual(['Количество должно быть больше 0'])
    expect(wrapper.emitted('sendForm')).toBeUndefined()
  })

  it('эмитит sendForm один раз за один submit валидной формы', async () => {
    const wrapper = mountForm(reactive(validModel()))

    await submit(wrapper)

    expect(wrapper.emitted('sendForm')).toHaveLength(1)
  })
})

describe('ReserveForm: категория', () => {
  it('преобразует пустую строку в null', async () => {
    const model = reactive<Partial<Reserve>>(modelWith({ category_id: 1 }))
    const wrapper = mountForm(model)

    wrapper.findComponent(CategorySelect).vm.$emit('update:model', '')
    await wrapper.vm.$nextTick()

    expect(model.category_id).toBeNull()
  })

  it('преобразует строковый id в число', async () => {
    const model = reactive<Partial<Reserve>>(modelWith({ category_id: null }))
    const wrapper = mountForm(model)

    wrapper.findComponent(CategorySelect).vm.$emit('update:model', '3')
    await wrapper.vm.$nextTick()

    expect(model.category_id).toBe(3)
  })

  it('показывает пустое значение, когда категория не выбрана', () => {
    const wrapper = mountForm(reactive(modelWith({ category_id: null })))

    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('')
  })

  it('показывает выбранную категорию', () => {
    const wrapper = mountForm(reactive(modelWith({ category_id: 3 })))

    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe('3')
  })
})

describe('ReserveForm: дата записи', () => {
  it('показывает дату создания, когда она передана', () => {
    const wrapper = mountForm(reactive(validModel()), '2025-03-07T10:00:00+00:00')

    expect(wrapper.find('.value--readonly').text()).toBe('07.03.2025')
  })

  it('не показывает блок даты без createdAt', () => {
    const wrapper = mountForm(reactive(validModel()))

    expect(wrapper.find('.value--readonly').exists()).toBe(false)
  })
})

describe('ReserveForm: отмена', () => {
  it('возвращает к списку запасов', async () => {
    const wrapper = mountForm(reactive(validModel()))

    // Кнопки в блоке: [0] — Сохранить (submit), [1] — Отмена.
    const buttons = wrapper.findAll('.button-wrapper button')
    expect(buttons).toHaveLength(2)
    await at(buttons, 1).trigger('click')

    expect(routerMock.push).toHaveBeenCalledWith({ path: '/reserves' })
  })
})
