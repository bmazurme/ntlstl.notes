 
import { MarkdownEditorView, useMarkdownEditor } from '@gravity-ui/markdown-editor';
import { Button, Select, TextInput, Text } from '@gravity-ui/uikit';
import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { toaster } from '../../main';
import { setTypes, typesSelector, useGetTypesMutation, type NoteResponse } from '../../store';

import { type FormPayload } from './edit-form-payload';
import style from './edit-form.module.css';
import fields from './form.fields';
import { TEXT_INPUT_PROPS } from './text-input-props';


interface EditLayoutProps {
  title: string;
  data?: NoteResponse;
  action: (formData: FormPayload) => Promise<void>;
}

export default function EditForm({ title, data, action }: EditLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [getTypes, { isLoading }] = useGetTypesMutation();
  const types = useAppSelector(typesSelector);
  const {
    control, handleSubmit, register, setValue, formState: { errors },
  } = useForm<FormPayload>({
    defaultValues: {
      title: data?.title || '',
      type: data?.type?.name || '',
      preview: data?.preview || '',
      content: data?.content || '',
    },
  });

  const canGoBack = location.key !== 'default';
  const handleBack = useCallback(() => {
      if (canGoBack) {
        navigate(-1);
      } else {
        navigate('/');
      }
    }, [navigate, canGoBack]);

  const contentEditor = useMarkdownEditor({
    initial: {
      markup: data?.content || '',
    },
    md: { html: false },
  });
  const previewEditor = useMarkdownEditor({
    initial: {
      markup: data?.preview || '',
    },
    md: { html: false },
  });

  useEffect(() => {
    const updateFormValues = () => {
      setValue('preview', previewEditor.getValue());
      setValue('content', contentEditor.getValue());
    };

    const handleChange = () => updateFormValues();

    previewEditor.on('change', handleChange);
    contentEditor.on('change', handleChange);

    return () => {
      previewEditor.off('change', handleChange);
      contentEditor.off('change', handleChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setValue]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await getTypes().unwrap();
        dispatch(setTypes(types));
      } catch {
        toaster.add({ name: 'fetch-types-form-error', title: 'Не удалось загрузить типы', theme: 'danger' });
      }
    };

    fetchTypes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      className={style.form}
      aria-label={title}
      onSubmit={handleSubmit(action)}
    >
      <div className={style.header}>
        <Text variant="subheader-1">
          {title}
        </Text>
        <div className={style.tools}>
          <Button
            view="flat"
            size="s"
            onClick={handleBack}
          >
            Cancel
          </Button>
          <Button
            view="action"
            size="s"
            type="submit"
          >
            Save
          </Button>
        </div>
      </div>
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
                  aria-required={!!input.required}
                  aria-invalid={!!fieldState.error}
                />
              )
              : (
                <Select
                  label="Тип заметки"
                  size="l"
                  width="max"
                  {...register}
                  onUpdate={field.onChange}
                  defaultValue={field.value ? [field.value] : []}
                  errorMessage={fieldState.error?.message}
                  validationState={errors?.type ? 'invalid' : undefined}
                  placeholder={isLoading ? 'Загрузка...' : 'Выберите вариант'}
                  disabled={isLoading}
                  aria-required={true}
                  aria-invalid={!!errors?.type}
                  options={types.map(({ id, name }) => ({ id, value: id.toString(), content: name }))}
                />
              )
          )}
        />
      ))}
      <MarkdownEditorView
        stickyToolbar
        autofocus
        editor={previewEditor}
        className={style.preview}
      />
      <MarkdownEditorView
        stickyToolbar
        autofocus
        editor={contentEditor}
        className={style.content}
      />
    </form>
  );
};
