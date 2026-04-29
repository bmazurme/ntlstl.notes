import { Button } from '@gravity-ui/uikit';
import { useToaster } from '@gravity-ui/uikit';

import BrokenComponent from '../components/BrokenComponent';
import ContentWrapper from '../components/ContentWrapper';

function KitPage() {
  const { add } = useToaster();
  const addToast = () => add({
    title: 'Title',
    content: 'text',
    theme: 'warning',
    name: 'any-toast'
  });
  
  return (
    <ContentWrapper
      children={(
        <>
          <section id="center">
            <Button
              view="outlined-action"
              size="m"
              onClick={addToast}
            >
              Add tost
            </Button>
            <BrokenComponent />
          </section>
        </>)}
      sidebar
    />
  )
}

export default KitPage;
