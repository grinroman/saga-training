import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import Blog from './pages/Blog';
import NotFound from './pages/NotFound';
import { Provider } from 'react-redux';
import store from './redux';
import { Router } from 'react-router';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter store={history}>
                <Routes>
                    <Route path="/" exact element={App} />
                    <Route path="/blog" exact element={Blog} />
                    <Route path="*" exact element={NotFound} />
                </Routes>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
