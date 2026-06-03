/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { MarkdownEditorView, useMarkdownEditor } from '@gravity-ui/markdown-editor';
import { Button, Select, TextInput } from '@gravity-ui/uikit';

import { setTypes, typesSelector, useGetTypesMutation, type NoteResponse } from '../../store';
import { useAppDispatch, useAppSelector } from '../../hooks';
import fields from './form.fields';
import { TEXT_INPUT_PROPS } from './text-input-props';
import { type FormPayload } from './edit-form-payload';

import style from './edit-form.module.css';

interface EditLayoutProps {
  data?: NoteResponse;
  action: (formData: FormPayload) => Promise<void>;
}

export default function EditForm({ data, action }: EditLayoutProps) {
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

  // Синхронизируем значения редакторов с формой
  useEffect(() => {
    const updateFormValues = () => {
      setValue('preview', previewEditor.getValue());
      setValue('content', contentEditor.getValue());
    };

    // Обновляем форму при изменении в редакторах
    const handleChange = () => updateFormValues();
    
    previewEditor.on('change', handleChange);
    contentEditor.on('change', handleChange);

    return () => {
      previewEditor.off('change', handleChange);
      contentEditor.off('change', handleChange);
    };
  }, [data, setValue]);

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
    <form
      className={style.form}
      onSubmit={handleSubmit(action)}
    >
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
                  defaultValue={field.value ? [field.value] : []}
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
      <Button
        view="action"
        size="l"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
};
