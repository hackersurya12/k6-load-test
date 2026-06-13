import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const res = http.get('https://suryamovies3.42web.io/');

  console.log(`Status: ${res.status}`);

  sleep(1);
}
