import type { Reserve } from '@/@types/reserve'
import {
  formatDate,
  formatDateTime,
  formatQuantity,
  getStatusLabel,
  getToggleLabel,
  toInputDate,
} from '@/utils/reserveHelpers'

// formatQuantity ожидает непустой quantity (так объявлен тип Reserve),
// поэтому для проверки защитной ветки приводим объект явно.
function quantityOf(quantity: unknown, unit?: unknown): Pick<Reserve, 'quantity' | 'unit'> {
  return { quantity, unit } as unknown as Pick<Reserve, 'quantity' | 'unit'>
}

describe('formatDate', () => {
  it('returns empty string for empty input', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
    expect(formatDate('')).toBe('')
  })

  it('converts ISO date to DD.MM.YYYY', () => {
    expect(formatDate('2025-03-07')).toBe('07.03.2025')
    expect(formatDate('2025-12-31')).toBe('31.12.2025')
  })

  it('keeps single-digit day and month without extra padding', () => {
    expect(formatDate('2025-01-05')).toBe('05.01.2025')
  })

  it('returns the input unchanged when it does not have three dash-separated parts', () => {
    expect(formatDate('2025-03')).toBe('2025-03')
    expect(formatDate('2025')).toBe('2025')
    expect(formatDate('07.03.2025')).toBe('07.03.2025')
    expect(formatDate('2025-03-07-01')).toBe('2025-03-07-01')
  })

  // Текущее поведение: для datetime третий кусок вместе со временем уходит в день.
  // Поэтому в компонентах дату берут через formatDateTime или slice(0, 10).
  it('mangles an ISO datetime because it only splits on dashes', () => {
    expect(formatDate('2025-03-07T10:00:00')).toBe('07T10:00:00.03.2025')
  })

  // Текущее поведение: функция не валидирует диапазоны, а просто переставляет части.
  it('does not validate ranges and only reorders parts', () => {
    expect(formatDate('2025-13-45')).toBe('45.13.2025')
    expect(formatDate('0000-00-00')).toBe('00.00.0000')
  })

  it('handles strings with an empty part', () => {
    expect(formatDate('2025--07')).toBe('07..2025')
  })
})

describe('formatDateTime', () => {
  it('drops the time part of an ISO datetime', () => {
    expect(formatDateTime('2025-03-07T10:00:00+00:00')).toBe('07.03.2025')
    expect(formatDateTime('2025-03-07T23:59:59.123Z')).toBe('07.03.2025')
  })

  it('works for a plain date string', () => {
    expect(formatDateTime('2025-03-07')).toBe('07.03.2025')
  })

  it('returns empty string for empty input', () => {
    expect(formatDateTime('')).toBe('')
  })
})

describe('formatQuantity', () => {
  it('formats integer quantity', () => {
    expect(formatQuantity({ quantity: 2 })).toBe('2')
    expect(formatQuantity({ quantity: 2, unit: null })).toBe('2')
  })

  it('appends the unit when present', () => {
    expect(formatQuantity({ quantity: 1.5, unit: 'л' })).toBe('1.5 л')
    expect(formatQuantity({ quantity: 2, unit: 'кг' })).toBe('2 кг')
  })

  it('strips trailing zeros of float values', () => {
    expect(formatQuantity({ quantity: 2.0 })).toBe('2')
    expect(formatQuantity({ quantity: 1.5 })).toBe('1.5')
    expect(formatQuantity({ quantity: 1.50 })).toBe('1.5')
    expect(formatQuantity({ quantity: 10.0, unit: 'шт' })).toBe('10 шт')
  })

  it('rounds to three decimals', () => {
    expect(formatQuantity({ quantity: 1.23456 })).toBe('1.235')
    expect(formatQuantity({ quantity: 0.0001 })).toBe('0')
  })

  it('formats zero', () => {
    expect(formatQuantity({ quantity: 0, unit: 'шт' })).toBe('0 шт')
  })

  it('returns empty string for null or undefined quantity', () => {
    expect(formatQuantity(quantityOf(null))).toBe('')
    expect(formatQuantity(quantityOf(undefined))).toBe('')
  })

  it('omits the unit when it is empty, null or undefined', () => {
    expect(formatQuantity({ quantity: 3, unit: '' })).toBe('3')
    expect(formatQuantity({ quantity: 3, unit: null })).toBe('3')
    expect(formatQuantity({ quantity: 3, unit: undefined })).toBe('3')
  })
})

describe('getStatusLabel', () => {
  it('returns the label for an active reserve', () => {
    expect(getStatusLabel(true)).toBe('Активна')
  })

  it('returns the label for an inactive reserve', () => {
    expect(getStatusLabel(false)).toBe('Неактивна')
  })
})

describe('getToggleLabel', () => {
  it('offers to mark an active reserve as used', () => {
    expect(getToggleLabel(true)).toBe('Использовано')
  })

  it('offers to restore an inactive reserve', () => {
    expect(getToggleLabel(false)).toBe('Вернуть')
  })
})

describe('toInputDate', () => {
  it('returns empty string for empty input', () => {
    expect(toInputDate(null)).toBe('')
    expect(toInputDate(undefined)).toBe('')
    expect(toInputDate('')).toBe('')
  })

  it('keeps a plain date as is', () => {
    expect(toInputDate('2025-03-07')).toBe('2025-03-07')
  })

  it('cuts an ISO datetime down to YYYY-MM-DD', () => {
    expect(toInputDate('2025-03-07T10:00:00+00:00')).toBe('2025-03-07')
    expect(toInputDate('2025-03-07T00:00:00.000Z')).toBe('2025-03-07')
  })

  it('does not validate the value, only slices it', () => {
    expect(toInputDate('2025-13-45')).toBe('2025-13-45')
    expect(toInputDate('короткая')).toBe('короткая')
  })
})
