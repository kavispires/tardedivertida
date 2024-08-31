import * as functionsV2 from 'firebase-functions/v2';

export type FirebaseAuth = functionsV2.https.CallableRequest['auth'];

export type CallableRequestV2 = functionsV2.https.CallableRequest;

export type GenericCallableFunctionV2 = (data: any, auth: FirebaseAuth) => unknown;
