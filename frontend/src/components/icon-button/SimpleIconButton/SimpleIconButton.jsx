import PropTypes from 'prop-types';
import style from './SimpleIconButton.module.css';
import IconButton from '../IconButton/IconButton.jsx';

/**
 * Icon button with no state layer or complex styling
 */
export default function SimpleIconButton({
    disabled, autoFocus, onClick, label, name, toggle, className, ...other
}) {
    return (
        <IconButton
            disabled={disabled}
            autoFocus={autoFocus}
            onClick={onClick}
            label={label}
            name={name}
            buttonClassName={style.simpleIconButton}
            className={className}
            toggle={toggle}
            stateLayerColor={false}
            {...other}
        />
    );
}

SimpleIconButton.defaultProps = {
    disabled: false,
    autoFocus: false,
    onClick: undefined,
    toggle: undefined,
    className: '',
};

SimpleIconButton.propTypes = {
    /** Weither the button is disabled or not */
    disabled: PropTypes.bool,

    /** Weither the button gets the focus when the component mounts */
    autoFocus: PropTypes.bool,

    /** Action that should be executed when clicking on the button */
    onClick: PropTypes.func,

    /** Accessible label of the button */
    label: PropTypes.string.isRequired,

    /** Icon name */
    name: PropTypes.string.isRequired,

    /**
     * State of the button.
     * If no set, the button only has one state.
     * If true, the button is selected.
     * If false, the button is not selected.
     */
    toggle: PropTypes.bool,

    /** Additional class, useful for positionning the element */
    className: PropTypes.string,
};