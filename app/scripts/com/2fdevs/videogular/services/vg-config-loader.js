/**
 * @ngdoc service
 * @name com.2fdevs.videogular.service:vgConfigLoader
 *
 * @description
 * Config loader service:
 *
 * vgConfigLoader.loadConfig(url): Param `url` is a url to a config JSON.
 **/
"use strict";
angular.module("com.2fdevs.videogular")
    .service("vgConfigLoader", ["$http", "$q", "$sce", function ($http, $q, $sce) {
        this.loadConfig = function loadConfig(url) {
            var deferred = $q.defer();

            $http({method: 'GET', url: url}).then(
                function success(response) {
                    var result = response.data;

                    for (var i = 0, l = result.sources.length; i < l; i++) {
                        result.sources[i].src = $sce.trustAsResourceUrl(result.sources[i].src);
                    }

                    deferred.resolve(result);
                },
                function reject() {
                    deferred.reject();
                }
            );

            return deferred.promise;
        };
    }]);
