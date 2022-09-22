import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';
import rootSaga from './sagas';
// {context/*потом получим доступ внутри саг и экшенов*/,
//  sagaMonitor/*логгер наших саг */, onError,
//  effectMiddlewares/*позволяет дополнительно обрабатывать эффекты саги */}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    reducer,
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(rootSaga); //динамический запуск саги

export default store;
