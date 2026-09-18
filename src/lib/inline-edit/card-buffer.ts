// Pure state + persistence for the inline-edit draft buffer's "card" edits —
// changes to rows in services / industries / projects / packages made from the
// public page. Kept out of the React provider so the commit order and error
// reporting are unit-testable.

export type CardTable = 'services' | 'industries' | 'projects' | 'packages'

export interface PendingCreate { tempId: string; table: CardTable; body: Record<string, unknown> }

export interface CardState {
  /** `${table}:${id}` → fields edited so far, as API column names. */
  patches: Record<string, Record<string, unknown>>
  /** `${table}:${id}` → true when the admin deleted the card in this session. */
  removed: Record<string, true>
  created: PendingCreate[]
}

export const EMPTY_CARD_STATE: CardState = { patches: {}, removed: {}, created: [] }

export const cardKey = (table: CardTable, id: string) => `${table}:${id}`

async function send(url: string, method: string, body: Record<string, unknown> | undefined, what: string) {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.ok) return
  const data = await res.json().catch(() => null) as { error?: string; details?: Record<string, string[]> } | null
  const detail = data?.details ? Object.values(data.details).flat()[0] : data?.error
  throw new Error(detail ? `${what}: ${detail}` : `${what} failed`)
}

/** Persists the buffered card edits: deletes, then field patches, then creates.
 *  Sequential so an error names the exact card; throws on the first failure. */
export async function commitCardState(state: CardState): Promise<void> {
  for (const key of Object.keys(state.removed)) {
    const [table, id] = key.split(':')
    await send(`/api/admin/${table}/${id}`, 'DELETE', undefined, 'Deleting a card')
  }
  for (const [key, patch] of Object.entries(state.patches)) {
    if (state.removed[key]) continue // deleted after being edited — skip the pointless PATCH
    const [table, id] = key.split(':')
    await send(`/api/admin/${table}/${id}`, 'PATCH', patch, 'Saving a card')
  }
  for (const c of state.created) {
    await send(`/api/admin/${c.table}`, 'POST', c.body, `Adding "${String(c.body.name ?? c.body.title ?? 'card')}"`)
  }
}
