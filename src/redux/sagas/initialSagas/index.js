import {
    call,
    fork, // говорит нашему middleware выполнить не блокирующий вызов функции который мы ей передаём
    all,
    delay,
} from 'redux-saga/effects';

function* auth() {
    //тут типа диспатчим инфу про юзера и показываем правильные вьюшки
    yield delay(2000);
    console.log('auth ok');
    return true;
}

function* loadUsers() {
    const request = yield call(fetch, `https://swapi.dev/api/people`);
    // const data = yield call(request.json.bind(request)); или
    const data = yield call([request, request.json]);

    console.log(data);
}

export function* loadBasicData() {
    yield all([fork(auth), fork(loadUsers)]);
}
