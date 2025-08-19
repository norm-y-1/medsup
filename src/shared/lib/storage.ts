/** Small wrapper around localStorage with JSON and version namespace. */
const NAMESPACE = 'medsup.v1'

export function getKey(key: string): string {
  return `${NAMESPACE}:${key}`
}

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(getKey(key))
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(getKey(key), JSON.stringify(value))
}

export function remove(key: string): void {
  localStorage.removeItem(getKey(key))
}
