import { priceMc, type McParams } from './mc'

self.onmessage = (e: MessageEvent<{ id: number; params: McParams }>) => {
  const { id, params } = e.data
  const result = priceMc(params)
  ;(self as unknown as { postMessage(m: unknown): void }).postMessage({ id, result })
}
