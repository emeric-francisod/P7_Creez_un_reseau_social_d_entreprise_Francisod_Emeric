import PropTypes from 'prop-types';
import style from './TonalButton.module.css';
import Button from '../Button/Button.jsx';
import Icon from '../../Icon/Icon';
import { useSelector } from 'react-redux';
import { selectIsDarkTheme } from '../../../utils/selectors';

/**
 * Tonal button
 * Its value is given as the child of the button.
 * All additionnal props are passed to the DOM element.
 */
export default function TonalButton({
    disabled, autoFocus, onClick, label, children, icon, ...other
}) {
    const className = icon ? style.tonalButtonIcon : style.tonalButton;
    const isDarkTheme = useSelector(selectIsDarkTheme);

    return <Button
        classNames={className}
        disabled={disabled}
        autoFocus={autoFocus}
        onClick={onClick}
        label={label}
        stateLayerColor="on-secondary-container"
        {...other}
    >
        {icon && <Icon name={icon} className={style.icon} size={20} isWithText={true} isOnDark={isDarkTheme}/>}
        {children}
    </Button>;
}

TonalButton.defaultProps = {
    disabled: false,
    autoFocus: false,
    onClick: undefined,
    label: undefined,
    icon: undefined,
};

TonalButton.propTypes = {
    /** Weither the button is disabled or not. Defaults to false. */
    disabled: PropTypes.bool,

    /** Weither the button gets the focus when the component mounts. Defaults to false. */
    autoFocus: PropTypes.bool,

    /** Action that should be executed when clicking on the button */
    onClick: PropTypes.func,

    /**
     * Accessible label for the button.
     * It should be provided if the button value has no accessible text.
     */
    label: PropTypes.string,

    /** Name of the icon to add before the text. */
    icon: PropTypes.string,
};