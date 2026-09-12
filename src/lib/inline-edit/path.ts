// Minimal dot-path get/set for the plain JSON objects stored in
// static_pages.content_json. Numeric segments address array indices — JS
// allows string-indexed array access (`arr['0']` === `arr[0]`), so one
// implementation covers both objects and arrays without special-casing.

type PlainObject = Record<string, unknown>

export function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== 'object') return undefined
    return (acc as PlainObject)[key]
  }, obj)
}

export function setByPath<T>(obj: T, path: string, value: unknown): T {
  const keys = path.split('.')
  const root: PlainObject = Array.isArray(obj) ? [...(obj as unknown[])] as unknown as PlainObject : { ...(obj as PlainObject) }
  let cursor: PlainObject = root
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    const existing = cursor[key]
    cursor[key] = Array.isArray(existing) ? [...existing] : { ...(existing as PlainObject) }
    cursor = cursor[key] as PlainObject
  }
  cursor[keys[keys.length - 1]] = value
  return root as unknown as T
}
