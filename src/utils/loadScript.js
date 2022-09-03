import getPromise from "./getPromise";

function defaultLoadScript(url) {
  const {
    promise,
    reject,
    resolve
  } = getPromise()
  const element = document.createElement('script');

  element.src = url;
  element.type = 'text/javascript';
  element.async = true;

  element.onload = () => {
    resolve(element)
  };

  element.onerror = () => {
    reject(element)
  };
  try {
    return promise
  } finally {
    document.head.appendChild(element);
  }
}

export default function loadScript(url, customLoadFn = defaultLoadScript) {
  return customLoadFn(url)
}
