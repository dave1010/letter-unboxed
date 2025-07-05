import { render, screen } from '@testing-library/react';import Home from './page';import { vi } from 'vitest';import fs from 'fs';import path from 'path';describe('Home', () => {  beforeAll(() => {    vi.spyOn(fs, 'readFileSync').mockReturnValue('word1\nword2\nword3');    vi.spyOn(path, 'join').mockImplementation((...args) => args.join('/'));  });  afterAll(() => {    vi.restoreAllMocks();  });  it('renders a welcome message', async () => {    render(await Home());    expect(screen.getByText('Letter Unboxed')).toBeInTheDocument();
    expect(screen.getByText('Key')).toBeInTheDocument();
    expect(screen.getByText('[available]')).toBeInTheDocument();
    expect(screen.getByText('[required]')).toBeInTheDocument();
    expect(screen.getByText('[excluded]')).toBeInTheDocument();
    const aButton = screen.getByRole('button', { name: 'A' });
    expect(aButton).toHaveStyle('background-color: rgb(248, 215, 218)'); // Light red for unavailable
    expect(aButton).toHaveStyle('color: rgb(114, 28, 36)'); // Dark red for unavailable
  });
});