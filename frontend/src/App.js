import HiddenNavigationLink from './components/HiddenNavigationLink/HiddenNavigationLink.jsx';
import Icon from './components/Icon/Icon.jsx';
import Logo from './components/Logo/Logo.jsx';
import Button from './components/buttons/Button/Button.jsx';
import FilledButton from './components/buttons/FilledButton/FilledButton.jsx';
import TonalButton from './components/buttons/TonalButton/TonalButton.jsx';
import CheckboxLabel from './components/form-inputs/Checkbox/CheckboxLabel.jsx';

export default function App() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            padding: '2rem',
            alignItems: 'start',
        }}>
            <HiddenNavigationLink label="Skip to main content" target="/"/>
            <Logo/>
            <Icon name='search'/>
            <CheckboxLabel label='Test' onChange={(e) => {
                console.log(e);
            }}/>
            <Button action={(e) => {
                console.log(e);
            }} label="test label"/>
            <FilledButton action={(e) => {
                console.log(e);
            }} label="test label"/>
            <TonalButton action={(e) => {
                console.log(e);
            }} label="test label"/>
        </div>
    );
}
