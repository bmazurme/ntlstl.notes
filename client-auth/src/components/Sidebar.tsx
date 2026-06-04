import { useNavigate } from 'react-router-dom';
import { Button, Icon } from '@gravity-ui/uikit';
import { Plus } from '@gravity-ui/icons';

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <Button view="action" size="m" onClick={() => navigate('/add-note')}>
        <Icon data={Plus} size={14} />
        Add Note
      </Button>
      
      <ul>
        <li>1</li>
        <li>2</li>
      </ul>
    </div>
  );
}
