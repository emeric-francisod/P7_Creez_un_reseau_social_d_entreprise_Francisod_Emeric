import MainHeader from './MainHeader';
import { screen } from '@testing-library/react';
import { render } from '../../utils/tests/test-wrapper';
import userEvent from '../../utils/tests/user-event.js';
import '@testing-library/jest-dom';

describe('MainHeader component test suite', () => {
    const contentId = 'main-content';

    it('should render', () => {
        render(<MainHeader mainContentId={contentId} />);
    });

    it('should render with additional classes', () => {
        const testClass = 'test';
        render(<MainHeader mainContentId={contentId} className={testClass} />);
        const headerElt = screen.getByRole('banner');
        expect(headerElt).toHaveClass(testClass);
    });

    it('should change the theme when clicking on the theme button', async () => {
        const user = userEvent.setup();
        render(<MainHeader mainContentId={contentId} />);
        let themeButton = screen.getByRole('button', {
            name: 'Passer au mode sombre',
        });

        await user.click(themeButton);
        themeButton = screen.getByRole('button', {
            name: 'Passer au mode clair',
        });
        expect(document.body).toHaveClass('dark');

        await user.click(themeButton);
        screen.getByRole('button', { name: 'Passer au mode sombre' });
        expect(document.body).toHaveClass('light');
    });

    it('should focus the elements in the right order', async () => {
        const user = userEvent.setup();
        render(<MainHeader mainContentId={contentId} />);
        const hiddenLink = screen.getByRole('link', {
            name: 'Accéder directement au contenu',
        });
        const logoLink = screen.getByRole('link', {
            name: "Groupomania Retourner à la page d'accueil",
        });
        const themeButton = screen.getByRole('button', {
            name: 'Passer au mode sombre',
        });
        const logoutButton = screen.getByRole('button', {
            name: 'Se déconnecter',
        });

        await user.tab();
        expect(hiddenLink).toHaveFocus();

        await user.tab();
        expect(logoLink).toHaveFocus();

        await user.tab();
        expect(themeButton).toHaveFocus();

        await user.tab();
        expect(logoutButton).toHaveFocus();
    });

    it('should link to the main content', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <>
                <MainHeader mainContentId={contentId} />
                <main id={contentId}>Main content</main>
            </>,
        );
        const hiddenLink = screen.getByRole('link', {
            name: 'Accéder directement au contenu',
        });

        await user.click(hiddenLink);
        const mainElt = container.querySelector(`#${contentId}`);
        expect(mainElt).toHaveFocus();
    });

    it('should link to the home page', async () => {
        const user = userEvent.setup();
        render(<MainHeader mainContentId={contentId} />, {
            initialEntries: ['/test'],
            preloadedState: {
                user: { email: 'email', userId: 1, role: { roleId: 2 } },
            },
        });
        const logoLink = screen.getByRole('link', {
            name: "Groupomania Retourner à la page d'accueil",
        });

        await user.click(logoLink);
        const path = screen.getByTestId('search-path').textContent;
        expect(path).toBe('/');
    });
});
