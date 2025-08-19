/** Currency helpers kept pure so they are trivial to test with Jasmine & Jest. */

export function formatCents(cents: number, currency: string = 'USD'): string {
  const value = cents / 100
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value)
}

export function add(a: number, b: number): number {
  return a + b
}
