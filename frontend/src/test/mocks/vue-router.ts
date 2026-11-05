import { defineComponent, h } from 'vue'
import { vi } from 'vitest'

/**
 * Замена vue-router для компонентных тестов.
 *
 * Использование в спеке:
 *   vi.mock('vue-router', () => import('@/test/mocks/vue-router'))
 */
export const routerMock = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
}

export const routeMock: {
  params: Record<string, string>
  name: string
  path: string
} = {
  params: {},
  name: 'reserves',
  path: '/reserves',
}

export function useRouter() {
  return routerMock
}

export function useRoute() {
  return routeMock
}

/** RouterLink превращается в обычный <a>, чтобы можно было проверить href. */
export const RouterLink = defineComponent({
  name: 'RouterLink',
  props: {
    to: {
      type: [String, Object],
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => {
      const to = props.to
      const href = typeof to === 'string' ? to : (to as { path?: string }).path
      return h('a', { href }, slots.default?.())
    }
  },
})

/** Сбрасывает накопленные вызовы и параметры маршрута между тестами. */
export function resetRouterMock() {
  routerMock.push.mockReset()
  routerMock.replace.mockReset()
  routerMock.back.mockReset()
  routeMock.params = {}
  routeMock.name = 'reserves'
  routeMock.path = '/reserves'
}
