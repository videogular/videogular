'use strict';
describe('Directive: Videogular', function () {
	var element;
	var scope;

	beforeEach(module('myApp'));

	beforeEach(inject(function ($compile, $rootScope) {
		scope = $rootScope;
		element = angular.element("<div><videogular><video></video></videogular></div>");
		$compile(element)($rootScope);
	}));

	describe("videogular", function() {
		it("should have videogular", function() {
			scope.$digest();
			expect(element.html()).toContain('<video></video>');
		});
	});
});
