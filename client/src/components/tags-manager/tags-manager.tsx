/* eslint-disable react-hooks/set-state-in-effect */
import { Check, Pencil, TrashBin, Xmark } from '@gravity-ui/icons';
import {
  Button, Icon, Label, Skeleton, Text, TextInput,
} from '@gravity-ui/uikit';
import {
  useCallback, useEffect, useState, type KeyboardEvent,
} from 'react';

import { toaster } from '../../main';
import {
  useDeleteTagMutation,
  useGetTagsMutation,
  useUpdateTagMutation,
  type TagResponse,
} from '../../store';
import ConfirmDeleteModal from '../confirm-delete-modal';

import style from './tags-manager.module.css';

/** Управление глобальными тегами: переименование и удаление. */
export default function TagsManager() {
  const [getTags, { isLoading }] = useGetTagsMutation();
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();
  const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();

  const [tags, setTags] = useState<TagResponse[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<TagResponse | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await getTags().unwrap();
      setTags(data);
    } catch {
      toaster.add({
        name: 'fetch-tags-error',
        title: 'Не удалось загрузить теги',
        theme: 'danger',
      });
    }
  }, [getTags]);

  useEffect(() => {
    refresh();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startEdit = (tag: TagResponse) => {
    setEditId(tag.id);
    setEditName(tag.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
  };

  const saveEdit = async (tag: TagResponse) => {
    const name = editName.trim().replace(/\s+/g, ' ');
    if (!name || name === tag.name) {
      cancelEdit();
      return;
    }

    try {
      await updateTag({ id: tag.id, name }).unwrap();
      cancelEdit();
      await refresh();
      toaster.add({
        name: 'update-tag-success',
        title: 'Тег переименован',
        theme: 'success',
      });
    } catch {
      toaster.add({
        name: 'update-tag-error',
        title: 'Не удалось переименовать тег',
        theme: 'danger',
      });
    }
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>, tag: TagResponse) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveEdit(tag);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancelEdit();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTag(deleteTarget.id).unwrap();
      setDeleteTarget(null);
      await refresh();
      toaster.add({
        name: 'delete-tag-success',
        title: 'Тег удалён',
        theme: 'success',
      });
    } catch {
      setDeleteTarget(null);
      toaster.add({
        name: 'delete-tag-error',
        title: 'Не удалось удалить тег',
        theme: 'danger',
      });
    }
  };

  return (
    <div className={style.wrapper}>
      <div className={style.head}>
        <Text variant="subheader-2">Теги</Text>
        {!isLoading && (
          <Text
            variant="caption-2"
            color="secondary"
          >
            {tags.length}
          </Text>
        )}
      </div>

      {isLoading
        ? (
          <div className={style.list}>
            <Skeleton className={style.rowSkeleton} />
            <Skeleton className={style.rowSkeleton} />
            <Skeleton className={style.rowSkeleton} />
          </div>
        )
        : tags.length === 0
          ? (
            <Text
              variant="body-1"
              color="secondary"
            >
              Пока нет ни одного тега.
            </Text>
          )
          : (
            <ul className={style.list}>
              {tags.map((tag) => (
                <li
                  key={tag.id}
                  className={style.row}
                >
                  {editId === tag.id
                    ? (
                      <>
                        <TextInput
                          size="m"
                          value={editName}
                          autoFocus
                          disabled={isUpdating}
                          onUpdate={setEditName}
                          onKeyDown={(event) => handleEditKeyDown(event, tag)}
                        />
                        <div className={style.actions}>
                          <Button
                            view="action"
                            size="m"
                            loading={isUpdating}
                            aria-label="Сохранить название тега"
                            onClick={() => saveEdit(tag)}
                          >
                            <Icon
                              data={Check}
                              size={16}
                              aria-hidden="true"
                            />
                          </Button>
                          <Button
                            view="flat"
                            size="m"
                            disabled={isUpdating}
                            aria-label="Отменить"
                            onClick={cancelEdit}
                          >
                            <Icon
                              data={Xmark}
                              size={16}
                              aria-hidden="true"
                            />
                          </Button>
                        </div>
                      </>
                    )
                    : (
                      <>
                        <div className={style.info}>
                          <Label
                            theme="info"
                            size="m"
                          >
                            {tag.name}
                          </Label>
                          {typeof tag.count === 'number' && (
                            <Text
                              variant="caption-2"
                              color="secondary"
                            >
                              {tag.count}
                              {' '}
                              {declOfNum(tag.count)}
                            </Text>
                          )}
                        </div>
                        <div className={style.actions}>
                          <Button
                            view="flat"
                            size="m"
                            aria-label={`Переименовать тег ${tag.name}`}
                            onClick={() => startEdit(tag)}
                          >
                            <Icon
                              data={Pencil}
                              size={16}
                              aria-hidden="true"
                            />
                          </Button>
                          <Button
                            view="flat-danger"
                            size="m"
                            aria-label={`Удалить тег ${tag.name}`}
                            onClick={() => setDeleteTarget(tag)}
                          >
                            <Icon
                              data={TrashBin}
                              size={16}
                              aria-hidden="true"
                            />
                          </Button>
                        </div>
                      </>
                    )}
                </li>
              ))}
            </ul>
          )}

      <ConfirmDeleteModal
        open={deleteTarget !== null}
        isLoading={isDeleting}
        title="Удалить тег?"
        description={
          deleteTarget
            ? `Тег «${deleteTarget.name}» будет удалён из всех заметок. Это действие нельзя отменить.`
            : ''
        }
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

/** Склонение слова «заметка» под число. */
function declOfNum(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'заметка';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'заметки';
  return 'заметок';
}
