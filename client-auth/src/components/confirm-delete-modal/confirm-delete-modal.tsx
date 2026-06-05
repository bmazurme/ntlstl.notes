import { Button, Modal, Text } from '@gravity-ui/uikit';

import style from './confirm-delete-modal.module.css';

interface ConfirmDeleteModalProps {
  open: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDeleteModal({ open, isLoading, onConfirm, onClose }: ConfirmDeleteModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}
    >
      <div
        className={style.container}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
      >
        <Text
          variant="header-1"
          id="confirm-delete-title"
        >
          Удалить заметку?
        </Text>
        <Text>Это действие нельзя отменить.</Text>
        <div className={style.actions}>
          <Button
            view="normal"
            size="m"
            onClick={onClose}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            view="outlined-danger"
            size="m"
            onClick={onConfirm}
            loading={isLoading}
          >
            Удалить
          </Button>
        </div>
      </div>
    </Modal>
  );
}
