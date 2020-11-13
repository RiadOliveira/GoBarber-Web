import React from 'react';
import GlobalStyle from './styles/global';
import AppProvider from './hooks';
import Routes from './routes';

const App: React.FC = () => {
    return (
        <>
            <AppProvider>
                <Routes />
            </AppProvider>

            <GlobalStyle />
        </>
    );
};

export default App;
