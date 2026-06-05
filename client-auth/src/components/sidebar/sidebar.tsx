import { useEffect } from 'react';
import { useNavigate, useParams, useMatch } from 'react-router-dom';
import { Button, Icon } from '@gravity-ui/uikit';
import { Plus, Hashtag, Layers } from '@gravity-ui/icons';

import ProtectedWrapper from '../protected-wrapper';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setTypes, typesSelector, useGetTypesMutation } from '../../store';
import { toaster } from '../../main';

export default function Sidebar() {
  const navigate = useNavigate();
  const { typeId } = useParams();
  const isAllNotes = !useMatch('/notes/type/:typeId');
  const dispatch = useAppDispatch();
  const types = useAppSelector(typesSelector);
  const [getTypes] = useGetTypesMutation();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getTypes().unwrap();
        dispatch(setTypes(types));
      } catch {
        toaster.add({ name: 'fetch-types-error', title: 'Не удалось загрузить типы', theme: 'danger' });
      }
    };

    fetchTypes();
  }, []);

  return (
    <div className="sidebar">
      <ProtectedWrapper>
        <Button view="action" size="m" onClick={() => navigate('/add-note')}>
          <Icon data={Plus} size={14} />
          Add Note
        </Button>
      </ProtectedWrapper>
      <Button view={isAllNotes ? 'normal' : 'flat'} size="m" onClick={() => navigate('/')}>
        <Icon data={Layers} size={14} />
        All notes
      </Button>
      {types.map((type) => (
        <Button
          key={type.id}
          view={typeId === String(type.id) ? 'normal' : 'flat'}
          size="m"
          onClick={() => navigate(`/notes/type/${type.id}`)}
        >
          <Icon data={Hashtag} size={14} />
          {type.name}
        </Button>
      ))}
    </div>
  );
}
