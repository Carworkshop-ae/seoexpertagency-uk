import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { commitCardState, EMPTY_CARD_STATE, cardKey, type CardState } from '@/lib/inline-edit/card-buffer'

describe('commitCardState', () => {
  const calls: Array<{ url: string; method: string; body?: unknown }> = []
  beforeEach(() => {
    calls.length = 0
    vi.stubGlobal('fetch', vi.fn(async (url: string, init: RequestInit) => {
      calls.push({ url, method: init.method ?? 'GET', body: init.body ? JSON.parse(String(init.body)) : undefined })
      return { ok: true, json: async () => ({}) }
    }))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('does nothing for an empty buffer', async () => {
    await commitCardState(EMPTY_CARD_STATE)
    expect(calls).toEqual([])
  })

  it('deletes, then patches, then creates — and skips patches for deleted cards', async () => {
    const state: CardState = {
      patches: {
        [cardKey('industries', 'a')]: { name: 'A2' },
        [cardKey('industries', 'gone')]: { name: 'never sent' },
      },
      removed: { [cardKey('industries', 'gone')]: true },
      created: [{ tempId: 'new-1', table: 'services', body: { name: 'New' } }],
    }
    await commitCardState(state)
    expect(calls.map(c => `${c.method} ${c.url}`)).toEqual([
      'DELETE /api/admin/industries/gone',
      'PATCH /api/admin/industries/a',
      'POST /api/admin/services',
    ])
    expect(calls[1].body).toEqual({ name: 'A2' })
  })

  it('names the failing card with the server message', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({ error: 'The slug "energy" is already in use' }) })))
    await expect(commitCardState({ ...EMPTY_CARD_STATE, created: [{ tempId: 'x', table: 'industries', body: { name: 'Energy' } }] }))
      .rejects.toThrow('Adding "Energy": The slug "energy" is already in use')
  })
})
