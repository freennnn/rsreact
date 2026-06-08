import { useState } from 'react'

import { Card } from '../../components/Card'
import { Modal } from '../../components/Modal/Modal'
import { HookFormRegistration } from '../../components/forms/HookFormRegistration'
import { UncontrolledRegistration } from '../../components/forms/UncontrolledRegistration'
import { useAppSelector } from '../../data/store'
import { selectLastAddedUserId, selectUsers } from '../../data/usersSlice'
import './UsersPage.css'

type ModalType = 'hook' | 'uncontrolled' | null

const MODAL_TITLES: Record<Exclude<ModalType, null>, string> = {
  hook: 'React Hook Form Registration',
  uncontrolled: 'Uncontrolled Form Registration',
}

const MODAL_TITLE_IDS: Record<Exclude<ModalType, null>, string> = {
  hook: 'hook-form-modal-title',
  uncontrolled: 'uncontrolled-form-modal-title',
}

export default function UsersPage() {
  const users = useAppSelector(selectUsers)
  const lastAddedUserId = useAppSelector(selectLastAddedUserId)
  const [modalType, setModalType] = useState<ModalType>(null)

  const handleCloseModal = () => {
    setModalType(null)
  }

  return (
    <div className='gallery-page'>
      <h1 className='page-title'>User Management</h1>
      <div className='nav-links'>
        <button type='button' className='nav-link' onClick={() => setModalType('hook')}>
          Add user with React Hook Form
        </button>
        <button type='button' className='nav-link' onClick={() => setModalType('uncontrolled')}>
          Add user with uncontrolled Form
        </button>
      </div>
      <div className='cards-and-details'>
        <div className='card-gallery'>
          {users.length > 0 ? (
            users.map((item) => (
              <Card key={item.id} user={item} wasAddedLast={lastAddedUserId === item.id} />
            ))
          ) : (
            <p>No users were created yet</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={modalType !== null}
        onClose={handleCloseModal}
        title={modalType ? MODAL_TITLES[modalType] : ''}
        titleId={modalType ? MODAL_TITLE_IDS[modalType] : 'registration-modal-title'}
      >
        {modalType === 'hook' && <HookFormRegistration key='hook' onSuccess={handleCloseModal} />}
        {modalType === 'uncontrolled' && (
          <UncontrolledRegistration key='uncontrolled' onSuccess={handleCloseModal} />
        )}
      </Modal>
    </div>
  )
}
