import { Modal } from './Modal'

export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', danger = false }) {
  return <Modal open={open} onClose={onClose} eyebrow={danger ? 'PLEASE CONFIRM' : 'CONFIRM ACTION'} title={title} description={description} size="small"
    footer={<><button className="quiet" onClick={onClose}>Cancel</button><button className={danger ? 'danger solid-danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</button></>}>
    {danger && <div className="confirm-warning">This action cannot be undone.</div>}
  </Modal>
}
