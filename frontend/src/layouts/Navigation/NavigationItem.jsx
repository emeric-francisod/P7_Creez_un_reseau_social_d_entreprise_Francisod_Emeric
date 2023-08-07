import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon/Icon';
import { useSelector } from 'react-redux';
import { selectIsDarkTheme } from '../../utils/selectors.js';
import style from './NavigationItem.module.css';

/**
 * Navigation item for the different navigation elements
 */
export default function NavigationItem({
    label, icon, target, active,
}) {
    const isOnDark = useSelector(selectIsDarkTheme);

    return <li className={active ? style.activeItem : style.navigationItem}>
        <div className={style.activeIndicator}></div>
        <Link
            to={target}
            className={style.link}
            role="tab"
            aria-selected={active}
        >
            <div className={style.icon}>
                <Icon name={icon} fill={active} isOnDark={isOnDark} size={24}/>
            </div>
            {label}
        </Link>
    </li>;
}

NavigationItem.defaultProps = {
    active: false,
};

NavigationItem.propTypes = {
    // Name of the navigation item, required
    label: PropTypes.string.isRequired,

    // Icon of the navigation item, required
    icon: PropTypes.string.isRequired,

    // Target of the navigation item, required, must be a link
    target: PropTypes.string.isRequired,

    // Weither the navigation item is active or not
    active: PropTypes.bool,
};