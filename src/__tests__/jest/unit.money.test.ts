/**
 * Unit tests for currency helpers: deterministic, table-driven, and edge-safe.
 */
import { formatCents, add } from '../../shared/lib/money';

describe('money helpers', () => {
  it.each([
    [0, '$0.00'],
    [1, '$0.01'],
    [199, '$1.99'],
    [12345, '$123.45'],
    [999999, '$9,999.99'],
  ])('formatCents(%s) -> %s', (cents, expectedStart) => {
    const formatted = formatCents(cents);
    expect(formatted).toBeDefined();
    expect(formatted.startsWith(expectedStart)).toBe(true);
  });

  it('supports different currencies (locale and symbol handled by Intl)', () => {
    const eur = formatCents(12345, 'EUR');
    // We don’t assert exact symbol/spacing (varies by runtime), only numeric part:
    expect(eur).toContain('123.45');
  });

  it('add() is exact for integers (no FP surprises)', () => {
    expect(add(200, 300)).toBe(500);
    expect(add(0, 0)).toBe(0);
  });
});
