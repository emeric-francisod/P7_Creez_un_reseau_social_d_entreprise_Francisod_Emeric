import PropTypes from 'prop-types';
import style from './TextField.module.css';
import { useId, useRef } from 'react';
import * as TextBox from '../TextBox/index.js';
import SupportText from '../SupportText/SupportText';

/**
 * Text field component. It is a controlled component.
 * Allows to create text, password, email, tel and url inputs.
 * All additionnal props are given to the input, so passing autoFocus, disabled and such is possible.
 */
export default function TextField({
    value,
    onChange,
    type,
    label,
    supportText,
    errorMessage,
    leadingIconProps,
    trailingIconProps,
    className,
    disabled,
    required,
    placeholder,
    ...props
}) {
    const supportTextId = useId();
    const inputRef = useRef();
    const inputId = useId();

    const leadingIcon = leadingIconProps && (
        <TextBox.TextBoxIcon {...leadingIconProps} position="leading" />
    );

    const trailingIcon =
        trailingIconProps || errorMessage ?
            <TextBox.TextBoxIcon
                name={
                    errorMessage && !trailingIconProps?.onClick ?
                        'error'
                    :   trailingIconProps.name
                }
                label={
                    errorMessage && !trailingIconProps?.onClick ?
                        'Error'
                    :   trailingIconProps.label
                }
                onClick={trailingIconProps?.onClick}
                disabled={disabled}
                position="trailing"
            />
        :   undefined;

    return (
        <TextBox.Root
            focusInput={() => inputRef.current?.focus?.()}
            hasPlaceholder={!!placeholder}
            hasValue={!!value}
            isDisabled={disabled}
            hasError={!!errorMessage}
            className={className}
            {...((supportText || errorMessage) && { labelId: supportTextId })}
        >
            <TextBox.InteractiveContainer
                label={label}
                leadingIcon={leadingIcon}
                trailingIcon={trailingIcon}
                inputId={inputId}
                required={required}
            >
                <input
                    value={value}
                    onChange={onChange}
                    type={type}
                    id={inputId}
                    disabled={disabled}
                    required={required}
                    placeholder={placeholder}
                    className={style.input}
                    ref={inputRef}
                    aria-invalid={!!errorMessage}
                    {...props}
                />
            </TextBox.InteractiveContainer>

            <SupportText
                id={supportTextId}
                supportText={supportText}
                errorMessage={errorMessage}
                errorIcon={!!trailingIconProps?.onClick}
                required={required}
                disabled={disabled}
            />
        </TextBox.Root>
    );
}

TextField.defaultProps = {
    value: '',
    type: 'text',
    supportText: undefined,
    errorMessage: undefined,
    leadingIconProps: undefined,
    trailingIconProps: undefined,
    className: '',
    disabled: false,
    required: false,
    placeholder: undefined,
};

TextField.propTypes = {
    /** Current value of the test input */
    value: PropTypes.string,

    /** Function to execute when the value changes, required */
    onChange: PropTypes.func.isRequired,

    /** Type of the input, defaults to text */
    type: PropTypes.oneOf(['text', 'password', 'email', 'tel', 'url']),

    /** Label of the input, required */
    label: PropTypes.string.isRequired,

    /** Text giving more informations about the input */
    supportText: PropTypes.string,

    /** Error message. If it is given, then the input value is considered invalid */
    errorMessage: PropTypes.string,

    /* Object describing the leading icon */
    leadingIconProps: PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
    }),

    /* Object describing the trailing icon, adding an onClick transforms the icon into a button */
    trailingIconProps: PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        onClick: PropTypes.func,
    }),

    /** Additional class names to add to the container */
    className: PropTypes.string,

    /* Weither the input is disabled or not, defaults to false */
    disabled: PropTypes.bool,

    /* Weither the input is required or not, defaults to false */
    required: PropTypes.bool,

    /* Placeholder for the input */
    placeholder: PropTypes.string,
};
