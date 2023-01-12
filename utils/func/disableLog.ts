export const GlobalDebug = (function () {
  const savedConsole = console;
  return function (debugOn: boolean, suppressAll?: boolean) {
    const suppress = suppressAll || false;
    if (debugOn === false) {
      console.log = function () {};
      if (suppress) {
        console.info = function () {};
        console.warn = function () {};
        console.error = function () {};
        console.debug = function () {};
      } else {
        console.info = savedConsole.info;
        console.warn = savedConsole.warn;
        console.error = savedConsole.error;
        console.debug = savedConsole.debug;
      }
    } else {
      console = savedConsole;
    }
  };
})();