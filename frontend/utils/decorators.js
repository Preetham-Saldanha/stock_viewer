// throttle

export function throttle(func, time) {
  let flag = 0;

  function runFunc() {
    setTimeout(function () {
      flag = 0;
    }, time);
  }

  return function () {
    if (flag === 0) {
      flag = 1;
      func();
      runFunc();
    }
  };
}

function mine() {
  console.log("mine");
}

mine = throttle(mine, 1000);
mine();
setTimeout(() => {
  mine();
}, 200);

setTimeout(() => {
  mine();
}, 500);
mine();

setTimeout(() => {
  mine();
}, 1200);

// +++++==============debounce====================

export function debounce(func, time) {
  let initial;

  function exec() {
    initial = setTimeout(() => {
      func();
    }, time);
  }

  // clearTimeout(initial);
  return function () {
    if (initial !== undefined) clearInterval(initial);
    exec();
  };
}
