import Logo from '../../components/Logo/Logo.jsx';
import { useSelector, useStore } from 'react-redux';
import { selectTheme } from '../../utils/selectors.js';
import { THEMES_NAMES, themeToggle } from '../../features/theme/theme.slice';
import PropTypes from 'prop-types';
import { useMutation } from '@tanstack/react-query';
import { simpleFetch } from '../../utils/fetch';
import { logout } from '../../features/authentication/user.slice';
import TopAppBar from '../../components/TopAppBar/TopAppBar';

/**
 * Main header off the application, used for the top level pages.
 */
export default function MainHeader({ mainContentId, ...props }) {
    const theme = useSelector(selectTheme);
    const { dispatch } = useStore();
    const { mutate } = useMutation({
        mutationFn: async () => {
            return simpleFetch({
                url: '/data/logout',
                method: 'POST',
            });
        },
        onSettled: () => {
            dispatch(logout());
        },
    });

    function handleLogoutClick(e) {
        mutate();
    }

    return <TopAppBar
        hiddenLinkTargetId={mainContentId}
        actions={[
            {
                label: theme === THEMES_NAMES.dark ? 'Passer au mode clair' : 'Passer au mode sombre',
                onClick: () => dispatch(themeToggle()),
                icon: theme === THEMES_NAMES.dark ? 'light_mode' : 'dark_mode',
            },
            {
                label: 'Se déconnecter',
                onClick: handleLogoutClick,
                icon: 'logout',
            },
        ]}
        className={props.className || ''}
    >
        <Logo label="Retourner à la page d'accueil" target="/"/>
    </TopAppBar>;
}

MainHeader.propTypes = {
    /** Id of the main content, to create a link to it */
    mainContentId: PropTypes.string.isRequired,
};