'use strict';
describe('Directive: Videogular Utils', function () {

  beforeEach(module('com.2fdevs.videogular'));

  var VG_UTILS;
  beforeEach(inject(function (_VG_UTILS_) {
    VG_UTILS = _VG_UTILS_;
  }));

  describe("supportsLocalStorage - ", function() {
    it('should return false if sessionStorage unrichable', inject(function ($window) {

      // Emulate browser restrictions
      Object.defineProperty($window, 'sessionStorage', {
        get: function () {
          throw new Error('Access is denied');
        }
      });

      var fn = function () {
        VG_UTILS.supportsLocalStorage();
      };

      expect(fn).not.toThrow();
      expect(VG_UTILS.supportsLocalStorage()).toBe(false);
    }));
  });

});
