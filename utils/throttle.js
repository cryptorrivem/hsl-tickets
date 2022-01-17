function throttle(callsPerSecond) {
  return function wrap(callback, ...params) {
    function handler(resolve, reject) {
      if (callsPerSecond === 0) {
        setTimeout(handler, 100, resolve, reject);
      } else {
        callsPerSecond--;
        callback(...params)
          .then((result) => {
            setTimeout(() => callsPerSecond++, 1000);
            resolve(result);
          })
          .catch(reject);
      }
    }
    return new Promise((resolve, reject) => handler(resolve, reject));
  };
}

module.exports = {
  throttle,
};
