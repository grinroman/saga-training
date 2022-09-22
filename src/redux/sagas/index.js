import {
    put,
    take,
    takeEvery,
    takeLatest,
    takeLeading,
    call,
    fork, // говорит нашему middleware выполнить не блокирующий вызов функции который мы ей передаём
    spawn, // делает так что сага ничего не знает о родителе => при ошибке не прекратит родительскую сагу, не блокирующая
    join,
    select,
} from 'redux-saga/effects';
//вспомогательные функции которые создают простые объекты которы создают инструкции
//которые выполняет сама redux saga middleware
//take - ждать указанному middleWare указанного действия dispatch

async function swappiGet(pattern) {
    const request = await fetch(`http://swapi.dev/api/${pattern}`);

    const data = await request.json();

    return data;
}

export function* loadingPeople() {
    const people = yield call(swappiGet, 'people'); // выполняет переданную функцию - если она вернёт promise то приостановит сагу до resolve'а
    yield put({ type: 'SET_PEOPLE', payload: people.results });
    return people;
}

export function* loadingPlanets() {
    const planets = yield call(swappiGet, 'planets'); // выполняет переданную функцию - если она вернёт promise то приостановит сагу до resolve'а
    yield put({ type: 'SET_PLANETS', payload: planets.results });
}

export function* workerSaga() {
    //запускается после выполненного action - наша бизнес-логика
    yield spawn(loadingPlanets); //2 запроса одновременно
    const task = yield fork(loadingPeople); // если нам помимо диспатча нужно сделать что-то ещё
    const people = yield join(task); // подождать пока тот наш запрос выполнится и забрать people
}

export function* watchLoadDataSaga() {
    //следт за нашими actions
    // while (true) {
    //     yield take('CLICK'); //Ждём выполнения действия
    //     yield workerSaga();
    // }

    yield takeEvery('LOAD_DATA', workerSaga); //приостанавливает выполнение саги пока не произойдёт диспатч в приложении
    // takeLatest - последний вызов клика - работает с промисами
    // takeLeading - берет первый и игнорт остальные
}

export default function* rootSaga() {
    // создание корневого процесса
    //далее саги работаю как граф
    yield fork(watchLoadDataSaga);
}
