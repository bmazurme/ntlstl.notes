import { Plus, Hashtag, Layers } from '@gravity-ui/icons';
import { Button, Icon, Skeleton } from '@gravity-ui/uikit';
import { useEffect } from 'react';
import { useNavigate, useParams, useMatch } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { toaster } from '../../main';
import { setTypes, typesSelector, useGetTypesMutation } from '../../store';
import ProtectedWrapper from '../protected-wrapper';

import style from './sidebar.module.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const { typeId } = useParams();
  const isAllNotes = !useMatch('/notes/type/:typeId');
  const dispatch = useAppDispatch();
  const types = useAppSelector(typesSelector);
  const [getTypes, { isLoading: isTypesLoading }] = useGetTypesMutation();

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

    fetchTypes();
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
          size="m"
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
                aria-current={isActive ? 'page' : undefined}
                onClick={() => navigate(`/notes/type/${type.id}`)}
              >
                <Icon
                  data={Hashtag}
                  size={14}
                  aria-hidden="true"
                />
                {type.name}
              </Button>
            );
          })}
    </nav>
  );
}
