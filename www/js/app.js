// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'firebase'])


  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

    });

    // Disable BACK button on home
    $ionicPlatform.registerBackButtonAction(function(event) {
      if ($state.current.name == "app.homepage") {
        navigator.app.exitApp();
      } else {
        navigator.app.backHistory();
      }
    }, 100);


  })


  .config(function($ionicConfigProvider) {
    $ionicConfigProvider.views.maxCache(5);

    // note that you can also chain configs
    $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
  })

  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'RegistrationController'
      })

      .state('app.homepage', {
        url: '/homepage',
        views: {
          'menuContent': {
            templateUrl: 'templates/homepage.html',
            controller: 'MainController'
          }
        }
      })

      .state('app.nownext', {
        url: '/nownext',
        views: {
          'menuContent': {
            templateUrl: 'templates/nownext.html',
            controller: 'MainController'
          }
        }
      })

      .state('app.artists', {
        url: '/artists',
        views: {
          'menuContent': {
            templateUrl: 'templates/artists.html',
            controller: 'MainController'
          }
        }
      })

      .state('app.bandinfo', {
        url: '/artists/:bandId',
        views: {
          'menuContent': {
            templateUrl: 'templates/bandinfo.html',
            controller: 'MainController'
          }
        }
      })


      .state('app.activities', {
        url: '/activities',
        views: {
          'menuContent': {
            templateUrl: 'templates/activities.html',
            controller: 'MainController'
          }
        }
      })

      .state('app.activityinfo', {
        url: '/activities/:activityId',
        views: {
          'menuContent': {
            templateUrl: 'templates/activityinfo.html',
            controller: 'MainController'
          }
        }
      })

      .state('app.stages', {
        url: '/stages',
        views: {
          'menuContent': {
            templateUrl: 'templates/stages.html',
            controller: 'MainController'
          }
        }
      })

      .state('app.schedule', {
        url: '/schedule',
        views: {
          'menuContent': {
            templateUrl: 'templates/schedule.html',
            controller: 'MainController'
          }
        }
      })

      .state('app.about', {
        url: '/about',
        views: {
          'menuContent': {
            templateUrl: 'about.html',
            controller: 'FestivalSelectController'
          }
        }
      })


      .state('app.landingpage', {
        url: '/landingpage',
        views: {
          'menuContent': {
            templateUrl: 'landingpage.html',
            controller: 'FestivalSelectController'
          }
        }
      })

      .state('app.log', {
        url: '/log',
        views: {
          'menuContent': {
            templateUrl: 'templates/log.html',
            controller: 'RegistrationController'
          }
        }
      })

      .state('app.register', {
        url: '/register',
        views: {
          'menuContent': {
            templateUrl: 'templates/register.html',
            controller: 'RegistrationController'
          }
        }
      })



    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/log');
  });
