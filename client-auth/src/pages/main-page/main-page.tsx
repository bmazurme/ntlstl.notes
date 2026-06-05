import ContentWrapper from '../../components/content-wrapper';
import Posts from '../../components/notes/notes';

function MainPage({ page }: { page?: number }) {
  return (
    <ContentWrapper
      children={(<Posts page={page} />)}
      sidebar
    />
  )
}

export default MainPage;
