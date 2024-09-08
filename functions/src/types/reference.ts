// eslint-disable-next-line
import * as functionsV2 from 'firebase-functions/v2';

export type FirebaseAuth = functionsV2.https.CallableRequest['auth'];

export type CallableRequest<T = any> = functionsV2.https.CallableRequest<T>;

export type GenericCallableFunction<T = any> = (data: T, auth: FirebaseAuth) => unknown;
