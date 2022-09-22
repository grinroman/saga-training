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
    all,
    delay,
} from 'redux-saga/effects';

import { loadBasicData } from './initialSagas';
import pageLoaderSaga from './pageLoaderSaga';

// export function* saga2() {
//     console.log('saga2');
// }

// export function* saga3() {
//     console.log('saga3');
// }

export default function* rootSaga() {
    // создание корневого процесса
    //далее саги работаю как граф
    // yield [saga1(), saga2(), saga3()]; // параллельный запуск и рут будет заблокирован
    //
    // - если будет ошибка то сама рут сага не будет выполнятся
    //yield [(fork(saga1), fork(saga2), fork(saga3))]; // fork предоставляет не блокирующий вызов
    //=> код выполнится сразу после данного
    //
    // работает как предыдущий
    // yield fork(saga1); auth
    // yield fork(saga2); payment
    // yield fork(saga3); users
    //
    // yield spawn(saga1); // исключаем прекращение работы корневой саги из-за ошибки 1-ой из саг
    // yield spawn(saga2);
    // yield spawn(saga3);

    const sagas = [loadBasicData, pageLoaderSaga];

    const retrySagas = sagas.map((saga) => {
        return spawn(function* () {
            while (true) {
                try {
                    yield call(saga);
                    break;
                } catch (error) {
                    console.log(error);
                }
            }
        });
    });

    yield all(retrySagas); //запустить все переданные эффекты параллельно и ждать их окончания.
    // 1 из эффектов блокирующий => all  тоже
}
