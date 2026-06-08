import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import './Modal.css'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1,
  )
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  titleId: string
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, titleId, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocusedRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null

    const focusFirstElement = () => {
      const panel = panelRef.current
      if (!panel) {
        return
      }
      const focusableElements = getFocusableElements(panel)
      focusableElements[0]?.focus()
    }

    const frameId = requestAnimationFrame(focusFirstElement)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const panel = panelRef.current
      if (!panel) {
        return
      }

      const focusableElements = getFocusableElements(panel)
      if (focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(frameId)
      document.removeEventListener('keydown', handleKeyDown)
      previouslyFocusedRef.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return createPortal(
    <div className='modal-backdrop' onClick={onClose} role='presentation'>
      <div
        ref={panelRef}
        className='modal-panel'
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className='modal-header'>
          <h2 id={titleId} className='modal-title'>
            {title}
          </h2>
          <button
            type='button'
            className='modal-close-button'
            aria-label='Close modal'
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
