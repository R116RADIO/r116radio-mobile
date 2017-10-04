// @flow

import { set, isEmpty } from 'lodash';

export async function App_Service({ url, method, params }) {
  const headers = {};
  set(headers, 'Accept', 'application/json');
  set(headers, 'Content-Type', 'application/json');

  const reqBody = {
    method,
    headers
  };

  if (!isEmpty(params)) {
    reqBody.body = JSON.stringify(params);
  }

  console.log('end point = ', url);
  console.log('req body = ', reqBody);
  return fetch(url, reqBody)
    .then((response) => response.json())
    .then((data) => {
      console.log('response body = ', data);
      return data;
    })
    .catch((error) => error);
}
