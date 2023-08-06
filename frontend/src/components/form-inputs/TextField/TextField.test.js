import '../../../utils/tests/window-mocks.js';
import TextField from './TextField.jsx';
import { getByLabelText, screen } from '@testing-library/react';
import { render } from '../../../utils/tests/test-wrapper.js';
import userEvent from '../../../utils/tests/user-event.js';
import '@testing-library/jest-dom';

describe('Textnput component test suite', () => {
    const props = {
        label: 'test label',
        onChange: jest.fn(),
    };

    afterEach(() => {
        props.onChange.mockClear();
    });

    it('should render the component', () => {
        render(<TextField {...props}/>);
        screen.getByRole('textbox', { name: props.label });
    });

    it('should have the right value', () => {
        const value = 'input value';
        render(<TextField {...props} value={value}/>);
        const textInputElt = screen.getByRole('textbox', { name: props.label });
        expect(textInputElt).toHaveValue(value);
    });

    it('should execute the onChange function when updated', async () => {
        const user = userEvent.setup();
        render(<TextField {...props}/>);
        const textInputElt = screen.getByRole('textbox', { name: props.label });

        await user.click(textInputElt);
        await user.keyboard('ab');

        expect(props.onChange).toHaveBeenCalledTimes(2);
    });

    it('should be the right input type', () => {
        const type = 'email';
        render(<TextField {...props} type={type}/>);
        const textInputElt = screen.getByRole('textbox', { name: props.label });
        expect(textInputElt).toHaveAttribute('type', type);
    });

    it('should have a support text, which describes the input', () => {
        const supportText = 'support text';
        render(<TextField {...props} supportText={supportText}/>);
        const supportTextElt = screen.getByText(supportText);
        const inputElt = screen.getByLabelText(props.label);

        expect(inputElt).toHaveAttribute('aria-describedby', supportTextElt.id);
    });

    it('should have an error message and the alert role', () => {
        const errorMessage = 'error message';
        render(<TextField {...props} errorMessage={errorMessage}/>);
        const errorMessageElt = screen.getByText(errorMessage);
        screen.getByLabelText('Error');

        const widgetElt = screen.getByRole('alert');
        expect(widgetElt).toHaveClass('textField');

        const inputElt = screen.getByLabelText(props.label);
        expect(inputElt).toHaveAttribute('aria-describedby', errorMessageElt.id);
    });

    it('should add an error icon in the support text if there is a trailing icon button', () => {
        const errorMessage = 'error message';
        const trailingIcon = {
            name: 'favorite',
            label: 'trailing icon',
            onClick: jest.fn(),
        };
        const { container } = render(<TextField {...props} errorMessage={errorMessage} trailingIcon={trailingIcon}/>);
        screen.getByText(errorMessage);
        screen.getByRole('button', { name: trailingIcon.label });
        const errorMessageElt = container.querySelector('.errorMessageWithIcon');
        getByLabelText(errorMessageElt, 'Error');
    });

    it('should choose the error message over the support text', () => {
        const errorMessage = 'error message';
        const supportText = 'support text';
        render(<TextField {...props} errorMessage={errorMessage} supportText={supportText}/>);
        const errorMessageElt = screen.getByText(errorMessage);
        screen.getByLabelText('Error');
        const widgetElt = screen.getByRole('alert');
        const supportTextElt = screen.queryByText(supportText);

        expect(widgetElt).toHaveClass('textField');
        expect(supportTextElt).toBeNull();

        const inputElt = screen.getByLabelText(props.label);
        expect(inputElt).toHaveAttribute('aria-describedby', errorMessageElt.id);
    });

    it('should have a leading icon', () => {
        const leadingIcon = {
            name: 'favorite',
            label: 'trailing icon',
        };
        render(<TextField {...props} leadingIcon={leadingIcon}/>);
        const leadingIconElt = screen.getByLabelText(leadingIcon.label);

        expect(leadingIconElt).toHaveTextContent(leadingIcon.name);
    });

    it('should have a trailing icon', () => {
        const trailingIcon = {
            name: 'favorite',
            label: 'trailing icon',
        };
        render(<TextField {...props} trailingIcon={trailingIcon}/>);
        const trailingIconElt = screen.getByLabelText(trailingIcon.label);

        expect(trailingIconElt).toHaveTextContent(trailingIcon.name);
    });

    it('should have a trailing icon button', async () => {
        const user = userEvent.setup();
        const trailingIcon = {
            name: 'favorite',
            label: 'trailing icon',
            onClick: jest.fn(),
        };
        render(<TextField {...props} trailingIcon={trailingIcon}/>);
        const trailingIconElt = screen.getByRole('button', { name: trailingIcon.label });

        expect(trailingIconElt).toHaveTextContent(trailingIcon.name);

        await user.click(trailingIconElt);

        expect(trailingIcon.onClick).toHaveBeenCalled();
        expect(trailingIconElt).not.toHaveFocus();
    });

    it('should give access to the trailing icon button using the keyboard', async () => {
        const user = userEvent.setup();
        const trailingIcon = {
            name: 'favorite',
            label: 'trailing icon',
            onClick: jest.fn(),
        };
        render(<TextField {...props} trailingIcon={trailingIcon}/>);
        const trailingIconElt = screen.getByRole('button', { name: trailingIcon.label });

        await user.tab();
        await user.tab();
        expect(trailingIconElt).toHaveFocus();

        await user.keyboard('{Enter}');
        await user.keyboard(' ');
        expect(trailingIcon.onClick).toHaveBeenCalledTimes(2);
    });

    it('should have an asterix next to the label when required', () => {
        render(<TextField {...props} required/>);
        const textInputElt = screen.getByRole('textbox', { name: props.label + '*' });
        screen.getByText('*requis', { exact: false });
        expect(textInputElt).toBeRequired();
    });

    it('should give additional props to the input element', () => {
        render(<TextField {...props} disabled/>);
        const textInputElt = screen.getByRole('textbox', { name: props.label });
        expect(textInputElt).toBeDisabled();
    });

    it('should disable the trailing icon button', () => {
        const trailingIcon = {
            name: 'favorite',
            label: 'trailing icon',
            onClick: jest.fn(),
        };
        render(<TextField {...props} trailingIcon={trailingIcon} disabled/>);
        const trailingIconElt = screen.getByRole('button', { name: trailingIcon.label });

        expect(trailingIconElt).toBeDisabled();
    });

    it('should be accessible using the keyboard', async () => {
        const user = userEvent.setup();
        render(<TextField {...props}/>);
        const textInputElt = screen.getByRole('textbox', { name: props.label });

        await user.tab();

        expect(textInputElt).toHaveFocus();
    });

    it('should be focusable using the label text', async () => {
        const user = userEvent.setup();
        render(<TextField {...props}/>);
        const textInputElt = screen.getByRole('textbox', { name: props.label });
        const labelElt = screen.getByText(props.label);

        await user.click(labelElt);

        expect(textInputElt).toHaveFocus();
    });

    it('should be focusable using the leading icon', async () => {
        const user = userEvent.setup();
        const leadingIcon = {
            name: 'favorite',
            label: 'leading icon',
        };
        render(<TextField {...props} leadingIcon={leadingIcon}/>);
        const textInputElt = screen.getByRole('textbox', { name: props.label });
        const leadingIconElt = screen.getByLabelText(leadingIcon.label);

        await user.click(leadingIconElt);

        expect(textInputElt).toHaveFocus();
    });

    it('should be focusable using the trailing icon', async () => {
        const user = userEvent.setup();
        const trailingIcon = {
            name: 'favorite',
            label: 'leading icon',
        };
        render(<TextField {...props} trailingIcon={trailingIcon}/>);
        const textInputElt = screen.getByRole('textbox', { name: props.label });
        const trailingIconelt = screen.getByLabelText(trailingIcon.label);

        await user.click(trailingIconelt);

        expect(textInputElt).toHaveFocus();
    });

    it('should have additional classnames', () => {
        const className = 'testClass';
        const { container } = render(<TextField {...props} className={className}/>);
        const widgetElt = container.querySelector('.textField');

        expect(widgetElt).toHaveClass(className);
    });
});