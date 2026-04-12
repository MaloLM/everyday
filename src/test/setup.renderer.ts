import '@testing-library/jest-dom'
import { vi } from 'vitest'

// --- Mock tailwindcss/resolveConfig (used by constants.tsx) ---
vi.mock('tailwindcss/resolveConfig', () => ({
  default: (config: any) => ({
    theme: {
      colors: config.theme?.extend?.colors ?? {},
    },
  }),
}))

// --- Mock window.electron (the preload bridge) ---
const electronMock = {
  requestData: vi.fn(),
  sendData: vi.fn().mockResolvedValue({ status: 'tam-result', message: [] }),
  saveTAMForm: vi.fn(),
  onResponseData: vi.fn().mockReturnValue(vi.fn()),
  loadNetWorthData: vi.fn().mockResolvedValue({ entries: [], currency: 'EUR' }),
  saveNetWorthEntry: vi.fn().mockResolvedValue({ entries: [], currency: 'EUR' }),
  deleteNetWorthEntry: vi.fn().mockResolvedValue({ entries: [], currency: 'EUR' }),
}

Object.defineProperty(window, 'electron', {
  value: electronMock,
  writable: true,
})

// --- Mock crypto.randomUUID (jsdom does not provide it) ---
let uuidCounter = 0
Object.defineProperty(globalThis, 'crypto', {
  value: {
    ...globalThis.crypto,
    randomUUID: () => `test-uuid-${++uuidCounter}`,
  },
  writable: true,
})

// --- Mock canvas for Chart.js ---
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  canvas: { width: 300, height: 150 },
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn().mockReturnValue({ width: 0 }),
  getImageData: vi.fn().mockReturnValue({ data: [] }),
  putImageData: vi.fn(),
  createLinearGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
  createRadialGradient: vi.fn().mockReturnValue({ addColorStop: vi.fn() }),
  createPattern: vi.fn(),
  beginPath: vi.fn(),
  closePath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  arc: vi.fn(),
  arcTo: vi.fn(),
  bezierCurveTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  rect: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  clip: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  translate: vi.fn(),
  transform: vi.fn(),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  setLineDash: vi.fn(),
  getLineDash: vi.fn().mockReturnValue([]),
  isPointInPath: vi.fn(),
  resetTransform: vi.fn(),
}) as any

// --- Mock scrollIntoView (not in jsdom) ---
Element.prototype.scrollIntoView = vi.fn()

// --- Mock requestAnimationFrame ---
if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => { cb(0); return 0 }
}

// --- Mock ResizeObserver (not in jsdom, used by Chart.js) ---
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any
}

// --- Reset mocks between tests ---
beforeEach(() => {
  vi.clearAllMocks()
  uuidCounter = 0
  electronMock.sendData.mockResolvedValue({ status: 'tam-result', message: [] })
  electronMock.onResponseData.mockReturnValue(vi.fn())
  electronMock.loadNetWorthData.mockResolvedValue({ entries: [], currency: 'EUR' })
  electronMock.saveNetWorthEntry.mockResolvedValue({ entries: [], currency: 'EUR' })
  electronMock.deleteNetWorthEntry.mockResolvedValue({ entries: [], currency: 'EUR' })
})
