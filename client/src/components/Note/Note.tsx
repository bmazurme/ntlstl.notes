import { Card, Text, Label } from '@gravity-ui/uikit';
import MarkdownPreview from '../../MarkdownPreview';

import style from './Note.module.css';

const Note = ({ title, value, labels }
  : { title: string; value: string; labels: string[] }) => {
  return (
    <Card
      theme="normal"
      size="l"
      className={style.preview}
    >
      <Text
        variant="header-2"
        className={style.title}
      >
        {title}
      </Text>

      <div className={style.markdown}>
        <MarkdownPreview
          getValue={() => value}
          allowHTML={true}
          breaks={true}
          linkify={true}
        />
      </div>

      <div className={style.labels}>
        {labels.map((label) => (
          <Label
            key={label}
            theme="clear"
          >
            {label}
          </Label>
        ))}
      </div>

    </Card>
  );
};

export default Note;
