import '@testing-library/jest-dom';
// Polyfill localStorage for Jest
class LocalStorageMock {
  private store: Record<string, string> = {}

  clear() {
    this.store = {}
  }

  getItem(key: string) {
    return this.store[key] ?? null
  }

  setItem(key: string, value: string) {
    this.store[key] = value.toString()
  }

  removeItem(key: string) {
    delete this.store[key]
  }
}

global.localStorage = new LocalStorageMock() as unknown as Storage
