import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};
export const AJAX = async (url, uploadData = undefined) => {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    console.log('url=', url);
    // race has to be an array
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    //const res = await fetch(url);
    const data = await res.json();
    console.log('data=', data);
    if (!res.ok) {
      console.log('=throwing errer');

      throw new Error(`${data.message}(${res.status})`);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

/*
export const getJSON = async url => {
  try {
    console.log('url=', url);
    // race has to be an array
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    //const res = await fetch(url);
    const data = await res.json();
    console.log('data=', data);
    if (!res.ok) {
      console.log('=throwing errer');

      throw new Error(`${data.message}(${res.status})`);
    }
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async (url, uploadData) => {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    //const res = await fetch(url);
    const data = await res.json();
    console.log('data=', data);
    if (!res.ok) {
      console.log('=throwing error');

      throw new Error(`${data.message}(${res.status})`);
    }
    return data;
  } catch (err) {
    //const res = await fetch(url);
    // const data = await res.json();
    // console.log('data=', data);
    // if (!res.ok) {
    //   console.log('=throwing errer');

    //   throw new Error(`${data.message}(${res.status})`);
    // }
    // return data;
    throw err;
  }
};*/
