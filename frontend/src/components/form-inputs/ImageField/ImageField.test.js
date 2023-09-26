import ImageField from './ImageField.jsx';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../../../utils/tests/test-wrapper.js';
import userEvent from '../../../utils/tests/user-event.js';
import '../../../utils/tests/window-mocks.js';
import '@testing-library/jest-dom';

describe('ImageField component test suite', () => {
    const emptyLabel = 'Test empty';
    const selectedLabel = 'Test selected';
    const mockOnChange = jest.fn();
    const fieldRef = { current: null };
    const props = {
        emptyLabel,
        selectedLabel,
        onChange: mockOnChange,
        ref: fieldRef,
    };
    const fileName = 'testfile.png';
    const file = new File(['test file'], fileName, { type: 'image/png' });

    afterEach(() => {
        mockOnChange.mockClear();
    });

    it('should render with the right label', () => {
        render(<ImageField {...props}/>);
        screen.getByRole('button', { name: emptyLabel });
    });

    it('should display the image and have the right label when the user choose an image', async () => {
        const user = userEvent.setup();
        render(<ImageField {...props}/>);
        screen.getByRole('button', { name: emptyLabel });

        await user.upload(fieldRef.current, file);
        await waitFor(() => {
            screen.getByRole('button', { name: selectedLabel });
            screen.getByRole('button', { name: /Supprimer/ });
            screen.getByAltText(fileName);
        });
    });

    it('should execute the onChange function with the file when the user chooses an image', async () => {
        const user = userEvent.setup();
        render(<ImageField {...props}/>);
        screen.getByRole('button', { name: emptyLabel });

        await user.upload(fieldRef.current, file);
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalled();
            expect(mockOnChange).toHaveBeenCalledWith(file);
        });
    });

    it('should reset its state when the user deletes the image', async () => {
        const user = userEvent.setup();
        render(<ImageField {...props}/>);
        screen.getByRole('button', { name: emptyLabel });

        await user.upload(fieldRef.current, file);
        await waitFor(() => {
            screen.getByAltText(fileName);
        });

        const deleteButton = screen.getByRole('button', { name: /Supprimer/ });
        await user.click(deleteButton);
        await waitFor(() => {
            screen.getByRole('button', { name: emptyLabel });
            const deleteButton = screen.queryByRole('button', { name: /Supprimer/ });
            const previewImage = screen.queryByAltText(fileName);
            expect(deleteButton).toBeNull();
            expect(previewImage).toBeNull();
        });
    });

    it('should execute the onChange function with null when the user deletes the image', async () => {
        const user = userEvent.setup();
        render(<ImageField {...props}/>);
        screen.getByRole('button', { name: emptyLabel });

        await user.upload(fieldRef.current, file);
        await waitFor(() => {
            screen.getByAltText(fileName);
        });

        const deleteButton = screen.getByRole('button', { name: /Supprimer/ });
        await user.click(deleteButton);
        await waitFor(() => {
            expect(mockOnChange).toHaveBeenCalled();
            expect(mockOnChange).toHaveBeenCalledWith(null);
        });
    });
});