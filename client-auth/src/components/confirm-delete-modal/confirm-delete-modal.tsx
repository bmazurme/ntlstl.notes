import { Button, Modal, Text } from '@gravity-ui/uikit';

interface ConfirmDeleteModalProps {
  open: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDeleteModal({ open, isLoading, onConfirm, onClose }: ConfirmDeleteModalProps) {
  return (
    <Modal open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '320px' }}>
        <Text variant="header-1">Удалить заметку?</Text>
        <Text>Это действие нельзя отменить.</Text>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
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
