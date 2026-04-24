import { useState } from 'react';
import { Button } from '@gravity-ui/uikit';

function BrokenComponent() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error('Компонент сломался!');
  }

  return (
    <div>
      <h3>Рабочий компонент</h3>
      <Button
        view="outlined-danger"
        size="m"
        onClick={() => setShouldCrash(true)}
      >
        Сломать компонент
      </Button>
    </div>
  );
}

export default BrokenComponent;
