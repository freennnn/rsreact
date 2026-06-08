import { describe, expect, it, vi } from 'vitest'

import { convertImageToBase64 } from './imageUtils'

describe('convertImageToBase64', () => {
  it('converts a file to a base64 data url', async () => {
    const file = new File(['image'], 'avatar.png', { type: 'image/png' })
    const readAsDataURL = vi.fn().mockImplementation(function (this: FileReader) {
      this.onloadend?.({} as ProgressEvent<FileReader>)
    })

    class MockFileReader {
      result = 'data:image/png;base64,aW1hZ2U='
      onloadend: (() => void) | null = null
      onerror: (() => void) | null = null
      readAsDataURL = readAsDataURL.mockImplementation(() => {
        this.onloadend?.()
      })
    }

    vi.stubGlobal('FileReader', MockFileReader)

    await expect(convertImageToBase64(file)).resolves.toBe('data:image/png;base64,aW1hZ2U=')

    vi.unstubAllGlobals()
  })
})
