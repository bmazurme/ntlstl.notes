import { Plus, CircleFill, Layers } from '@gravity-ui/icons';
import { Button, Icon, Label, Skeleton } from '@gravity-ui/uikit';
import { useEffect } from 'react';
import { useNavigate, useParams, useMatch } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { toaster } from '../../main';
import {
  setTags,
  setTypes,
  tagsSelector,
  typesSelector,
  useGetTagsMutation,
  useGetTypesMutation,
} from '../../store';
import ProtectedWrapper from '../protected-wrapper';

import style from './sidebar.module.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const { typeId } = useParams();
  const isAllNotes = !useMatch('/notes/type/:typeId');
  const tagMatch = useMatch('/notes/tag/:slug');
  const activeTagSlug = tagMatch?.params.slug;
  const dispatch = useAppDispatch();
  const types = useAppSelector(typesSelector);
  const tags = useAppSelector(tagsSelector);
  const [getTypes, { isLoading: isTypesLoading }] = useGetTypesMutation();
  const [getTags] = useGetTagsMutation();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getTypes().unwrap();
        dispatch(setTypes(types));
      } catch {
        toaster.add({
          name: 'fetch-types-error',
          title: 'Не удалось загрузить типы',
          theme: 'danger',
        });
      }
    };

    const fetchTags = async () => {
      try {
        const tags = await getTags().unwrap();
        dispatch(setTags(tags));
      } catch {
        // Облако тегов необязательно — молча игнорируем ошибку.
      }
    };

    fetchTypes();
    fetchTags();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav
      className="sidebar"
      aria-label="Фильтрация заметок"
    >
      <ProtectedWrapper>
        <Button
          view="action"
          size="l"
          aria-label="Создать новую заметку"
          onClick={() => navigate('/add-note')}
        >
          <Icon
            data={Plus}
            size={14}
            aria-hidden="true"
          />
          Add Note
        </Button>
      </ProtectedWrapper>

      <Button
        view={isAllNotes ? 'normal' : 'flat'}
        size="m"
        className={style.navButton}
        aria-current={isAllNotes ? 'page' : undefined}
        onClick={() => navigate('/')}
      >
        <Icon
          data={Layers}
          size={14}
          aria-hidden="true"
        />
        All notes
      </Button>

      {isTypesLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className={style.skeleton}
            />
          ))
        : types.map((type) => {
            const isActive = typeId === String(type.id);
            return (
              <Button
                key={type.id}
                view={isActive ? 'normal' : 'flat'}
                size="m"
                className={style.navButton}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => navigate(`/notes/type/${type.id}`)}
              >
                <Icon
                  data={CircleFill}
                  size={12}
                  aria-hidden="true"
                  style={{ color: type.color }}
                />
                {type.name}
              </Button>
            );
          })}

      {tags.length > 0 && (
        <>
          <div className={style.sectionTitle}>Теги</div>
          <div className={style.tagCloud}>
            {tags.map((tag) => {
              const isActive = activeTagSlug === tag.slug;
              return (
                <Label
                  key={tag.id}
                  size="m"
                  theme={isActive ? 'info' : 'normal'}
                  className={style.tag}
                  onClick={() => navigate(`/notes/tag/${tag.slug}`)}
                >
                  {`#${tag.name}${tag.count ? ` ${tag.count}` : ''}`}
                </Label>
              );
            })}
          </div>
        </>
      )}
    </nav>
  );
}
