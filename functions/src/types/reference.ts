// eslint-disable-next-line
import * as functions from 'firebase-functions/v2';

export type FirebaseAuth = functions.https.CallableRequest['auth'];

export type CallableRequest<T = any> = functions.https.CallableRequest<T>;

export type GenericCallableFunction<T = any> = (data: T, auth: FirebaseAuth) => unknown;
