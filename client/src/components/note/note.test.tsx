import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import type { NoteType } from '../../store/slices/notes-slice';
import { renderWithProviders } from '../../test/utils';

import Note from './note';

vi.mock('../markdown-preview/markdown-preview', () => ({
  default: ({ getValue }: { getValue: () => string }) => <div>{getValue()}</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockNote: NoteType = {
  id: 42,
  title: 'Тестовая заметка',
  preview: 'Краткое описание',
  content: 'Полный текст',
  type: { id: 1, name: 'Article' },
};

describe('Note', () => {
  it('отображает заголовок заметки', () => {
    renderWithProviders(<Note note={mockNote} />);
    expect(screen.getByText('Тестовая заметка')).toBeInTheDocument();
  });

  it('отображает тип заметки', () => {
    renderWithProviders(<Note note={mockNote} />);
    expect(screen.getByText('Article')).toBeInTheDocument();
  });

  it('имеет aria-label с названием заметки', () => {
    renderWithProviders(<Note note={mockNote} />);
    expect(screen.getByRole('link', { name: /Открыть заметку: Тестовая заметка/i })).toBeInTheDocument();
  });

  it('навигирует при клике', async () => {
    renderWithProviders(<Note note={mockNote} />);
    await userEvent.click(screen.getByRole('link'));
    expect(mockNavigate).toHaveBeenCalledWith('/note/42');
  });

  it('навигирует при нажатии Enter', async () => {
    renderWithProviders(<Note note={mockNote} />);
    const card = screen.getByRole('link');
    card.focus();
    await userEvent.keyboard('{Enter}');
    expect(mockNavigate).toHaveBeenCalledWith('/note/42');
  });

  it('карточка фокусируется с клавиатуры (tabIndex=0)', () => {
    renderWithProviders(<Note note={mockNote} />);
    expect(screen.getByRole('link')).toHaveAttribute('tabindex', '0');
  });
});
