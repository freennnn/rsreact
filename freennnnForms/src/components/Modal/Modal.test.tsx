import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Modal } from './Modal'

describe('Modal', () => {
  it('renders children in a portal attached to document.body', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title='Test Modal' titleId='test-modal-title'>
        <p>Modal content</p>
      </Modal>,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Modal content')).toBeInTheDocument()
    expect(document.body.contains(screen.getByRole('dialog'))).toBe(true)
  })

  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title='Test Modal' titleId='test-modal-title'>
        <p>Modal content</p>
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes on Escape key', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Modal isOpen onClose={onClose} title='Test Modal' titleId='test-modal-title'>
        <button type='button'>Inside modal</button>
      </Modal>,
    )

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when clicking the backdrop', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Modal isOpen onClose={onClose} title='Test Modal' titleId='test-modal-title'>
        <p>Modal content</p>
      </Modal>,
    )

    await user.click(screen.getByRole('presentation'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes when clicking the close button', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    render(
      <Modal isOpen onClose={onClose} title='Test Modal' titleId='test-modal-title'>
        <p>Modal content</p>
      </Modal>,
    )

    await user.click(screen.getByLabelText('Close modal'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('exposes dialog accessibility attributes', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title='Accessible Modal' titleId='accessible-modal-title'>
        <p>Modal content</p>
      </Modal>,
    )

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'accessible-modal-title')
    expect(screen.getByRole('heading', { name: 'Accessible Modal' })).toHaveAttribute(
      'id',
      'accessible-modal-title',
    )
  })
})
