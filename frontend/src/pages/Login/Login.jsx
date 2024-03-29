import AuthenticationForm from '../../features/authentication/AuthenticationForm/AuthenticationForm';
import style from './Login.module.css';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';
import { useAutoLogin } from './useAutoLogin';
import { useSetNavigationInfo } from '../../features/navigationInfo/useSetNavigationInfo';
import { useLocation } from 'react-router-dom';
import { useChangePageTitle } from '../../hooks/useChangePageTitle';

export const PAGE_NAME = 'Login';

/** Login page */
export default function Login() {
    useSetNavigationInfo(PAGE_NAME);
    const { state } = useLocation();
    const nextPage =
        state ? `${state.pathname}${state.search}${state.hash}` : '/';
    const authenticationError = useAutoLogin(nextPage);
    let content;

    useChangePageTitle('Groupomania - Login');

    if (authenticationError) {
        content = <AuthenticationForm />;
    } else {
        content = (
            <ProgressIndicator
                circular
                label="Tentative de connexion, veuillez patienter"
            />
        );
    }

    return <main className={style.login}>{content}</main>;
}
