import { useEffect } from 'react';
import { Button, Select, TextInput, type InputControlSize } from '@gravity-ui/uikit';
import { MarkdownEditorView, useMarkdownEditor, type MarkupString } from '@gravity-ui/markdown-editor';
import { Controller, useForm } from 'react-hook-form';

import { useAppSelector, useAppDispatch } from '../../hooks';
import { useCreateNoteMutation, useGetTypesMutation } from '../../store';
import { typesSelector, setTypes } from '../../store/slices/types-slice';
import fields from './form.fields';

import style from './form.module.css';

type FormPayload = {
  title: string;
  type: string;
};

const TEXT_INPUT_PROPS = {
  size: 'l' as InputControlSize,
  type: 'text' as const,
};

const Form = () => {
  const editorEditor = useMarkdownEditor({
    md: {
      html: false,
    },
  });

  const previewEditor = useMarkdownEditor({
    md: {
      html: false,
    },
  });

  const dispatch = useAppDispatch();
  const [createNote] = useCreateNoteMutation();
  const types = useAppSelector(typesSelector);
  const [getTypes, { isLoading }] = useGetTypesMutation();
  const {
    control, getValues, register, formState: { errors },
  } = useForm<FormPayload>({
    defaultValues: { title: '', type: '' },
  });

  const onSubmit = async (preview: MarkupString, content: MarkupString) => {
    try {
      const { title, type } = getValues();
      await createNote({ title, type: type[0], preview, content });
    } catch {
      console.log('err');
    }
  };
  useEffect(() => {
    function submitHandler() {
      // Serialize current content to markdown markup
      const content = editorEditor.getValue();
      const preview = previewEditor.getValue();
      onSubmit(preview, content);
    }

    editorEditor.on('submit', submitHandler);
    previewEditor.on('submit', submitHandler);

    return () => {
      editorEditor.off('submit', submitHandler);
      previewEditor.off('submit', submitHandler);
    };
  }, [onSubmit]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getTypes().unwrap();
        dispatch(setTypes(types));
      } catch (err) {
        console.log('err', err);
      }
    };

    fetchTypes();
  }, []);

  return (
    <div className={style.form}>
      {fields.map((input) => (
        <Controller
          key={input.name}
          name={input.name as keyof FormPayload}
          rules={{
            pattern: input.pattern,
            required: input.required,
          }}
          control={control}
          render={({ field, fieldState }) => (
            field.name !== 'type'
              ? (
                <TextInput
                  {...field}
                  {...input}
                  {...TEXT_INPUT_PROPS}
                  value={typeof field.value === 'string' ? field.value : ''}
                  error={fieldState.error?.message}
                />
              )
              : (
                <Select
                  label="Тип заметки"
                  size="l"
                  width="max"
                  {...register}
                  onUpdate={field.onChange}
                  errorMessage={fieldState.error?.message}
                  validationState={errors?.type ? 'invalid' : undefined}
                  placeholder={isLoading ? 'Загрузка...' : 'Выберите вариант'}
                  disabled={isLoading}
                  options={types.map(({ id, name }) => ({ id, value: id.toString(), content: name }))}
                />
              )
          )}
        />
      ))}
      <div className={style.editor}>
        Preview
        <MarkdownEditorView
          stickyToolbar
          autofocus
          editor={previewEditor}
          className={style.preview}
        />
        Content
        <MarkdownEditorView
          stickyToolbar
          autofocus
          editor={editorEditor}
          className={style.content}
        />
        <Button
          view="action"
          size="l"
          onClick={() => onSubmit(previewEditor.getValue(), editorEditor.getValue())}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default Form;
