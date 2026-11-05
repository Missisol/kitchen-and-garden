"""Тесты для утилитарных функций из app.reserves.routes."""
from datetime import date

from app.reserves.routes import _parse_date, _to_float, _validate_reserve


class TestToFloat:
    """Табличные тесты для _to_float."""

    def test_none(self):
        assert _to_float(None) is None

    def test_empty_string(self):
        assert _to_float('') is None

    def test_zero(self):
        assert _to_float(0) == 0.0
        assert _to_float('0') == 0.0

    def test_negative(self):
        assert _to_float(-1) == -1.0
        assert _to_float('-2.5') == -2.5

    def test_positive(self):
        assert _to_float(1) == 1.0
        assert _to_float(1.5) == 1.5
        assert _to_float('2.5') == 2.5
        assert _to_float('1e3') == 1000.0

    def test_invalid(self):
        assert _to_float('abc') is None
        assert _to_float('12.34.56') is None

    def test_non_numeric_string(self):
        assert _to_float('hello') is None


class TestParseDate:
    """Тесты для _parse_date."""

    def test_none(self):
        assert _parse_date(None) is None

    def test_empty_string(self):
        assert _parse_date('') is None

    def test_valid_iso(self):
        result = _parse_date('2025-03-07')
        assert result == date(2025, 3, 7)

    def test_invalid_date(self):
        assert _parse_date('не-дата') is None
        assert _parse_date('2025-13-45') is None
        assert _parse_date('2025-02-30') is None

    def test_datetime_string(self):
        # fromisoformat принимает и datetime-строки, но возвращает date
        result = _parse_date('2025-03-07T10:00:00')
        # datetime.fromisoformat возвращает datetime, но мы ловим TypeError
        assert result is None

    def test_with_timezone(self):
        result = _parse_date('2025-03-07T10:00:00+00:00')
        # datetime-строка с timezone → TypeError → None
        assert result is None

    def test_integer(self):
        assert _parse_date(2025) is None


class TestValidateReserve:
    """Тесты для _validate_reserve."""

    def test_none_data(self):
        assert _validate_reserve(None) == 'Request body is required'

    def test_empty_dict(self):
        assert _validate_reserve({}) == 'Request body is required'

    def test_missing_kind(self):
        assert _validate_reserve({'description': 'test', 'quantity': 1}) == 'Kind is required'

    def test_empty_kind(self):
        assert _validate_reserve({'kind': '', 'description': 'test', 'quantity': 1}) == 'Kind is required'

    def test_whitespace_kind(self):
        assert _validate_reserve({'kind': '   ', 'description': 'test', 'quantity': 1}) == 'Kind is required'

    def test_missing_description(self):
        # _validate_reserve не проверяет description — только kind и quantity.
        # Backend создаёт запись с пустым description.
        assert _validate_reserve({'kind': 'Рис', 'quantity': 1}) is None

    def test_empty_description(self):
        assert _validate_reserve({'kind': 'Рис', 'description': '', 'quantity': 1}) is None

    def test_whitespace_description(self):
        assert _validate_reserve({'kind': 'Рис', 'description': '   ', 'quantity': 1}) is None

    def test_missing_quantity(self):
        assert _validate_reserve({'kind': 'Рис', 'description': 'test'}) == 'Quantity must be greater than 0'

    def test_zero_quantity(self):
        assert _validate_reserve({'kind': 'Рис', 'description': 'test', 'quantity': 0}) == 'Quantity must be greater than 0'

    def test_negative_quantity(self):
        assert _validate_reserve({'kind': 'Рис', 'description': 'test', 'quantity': -1}) == 'Quantity must be greater than 0'

    def test_string_quantity(self):
        assert _validate_reserve({'kind': 'Рис', 'description': 'test', 'quantity': 'abc'}) == 'Quantity must be greater than 0'

    def test_valid_data(self):
        assert _validate_reserve({
            'kind': 'Рис',
            'description': 'Длиннозерный',
            'quantity': 2,
        }) is None

    def test_valid_data_with_all_fields(self):
        assert _validate_reserve({
            'kind': 'Рис',
            'description': 'Длиннозерный',
            'quantity': 2.5,
            'unit': 'кг',
            'expiry_date': '2025-12-31',
            'location': 'Кладовая',
            'place': 'Полка 2',
            'is_active': True,
        }) is None
