angular.module('starter.controllers', [])




  //this controller is used on the register and log-in pages of the application
  .controller('RegistrationController', ['$scope', 'Authentication', function($scope, Authentication) {

    //each of these functions travel via Authentication in the services.js file
    $scope.login = function() {
      Authentication.login($scope.user);
    };

    $scope.logout = function() {
      Authentication.logout();
    };

    $scope.register = function() {
      Authentication.register($scope.user);

    }; //register

  }]) //controller



  //this controller is used in the landing page of the application, where the user can select a festival.

  .controller('FestivalSelectController', function($scope, $ionicScrollDelegate, $ionicSlideBoxDelegate) {

    //to allow the slidebox to update after loading
    $ionicSlideBoxDelegate.update();
    $scope.onUserDetailContentScroll = onUserDetailContentScroll


    function onUserDetailContentScroll() {
      var scrollDelegate = $ionicScrollDelegate.$getByHandle('userDetailContent');
      var scrollView = scrollDelegate.getScrollView();
      $scope.$broadcast('userDetailContent.scroll', scrollView);
    }
  })


  // for the festival select parallax effects

  //influenced by ionic marketplace addon: https://github.com/kevincobain2000/ionic-parallax-profile
  .directive('headerShrink', function($document) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        var resizeFactor, scrollFactor, blurFactor;
        var header = $document[0].body.querySelector('.about-header');
        $scope.$on('userDetailContent.scroll', function(event, scrollView) {
          if (scrollView.__scrollTop >= 0) {
            scrollFactor = scrollView.__scrollTop / 1.2;
            header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, +' + scrollFactor + 'px, 0)';
          } else if (scrollView.__scrollTop > -70) {
            resizeFactor = -scrollView.__scrollTop / 100 + 0.99;
            // blurFactor = -scrollView.__scrollTop/50;
            header.style[ionic.CSS.TRANSFORM] = 'scale(' + resizeFactor + ',' + resizeFactor + ')';
            // header.style.webkitFilter = 'blur('+blurFactor+'px)';
          }
        });
      }
    }
  })


  //this controller can be used for Homepage, Now&Next, Artists, Activities, Stages and Personal Schedule pages

  .controller('MainController', ['$scope', '$firebaseArray', '$firebaseAuth', '$state', function($scope, $firebaseArray, $firebaseAuth, $state) {

    // creates new Firebase reference
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authUser) {
      if (authUser) {


        //retrieving artists data
        var artistsRef = ref.child('artists')
        var artistsInfo = $firebaseArray(artistsRef);
        $scope.artists = artistsInfo;
        $scope.pickedartist = $state.params.bandId;


        //filters out the current artist in the bandinfo page with regards to see more artists.
        // so you wont see the same artist in the see more artists slidebox
        $scope.avoidArtist = function(artist) {
          if (artist.shortname != $scope.pickedartist) {
            return true;
          }
        }


        //retrieving activities data
        var activitiesRef = ref.child('activities')
        var activitiesInfo = $firebaseArray(activitiesRef);
        $scope.activities = activitiesInfo;
        $scope.pickedactivity = $state.params.activityId;

        //filters out the current artist in the bandinfo page with regards to see more artists.
        // so you wont see the same artist in the see more artists slidebox
        $scope.avoidActivity = function(activity) {
          if (activity.shortname != $scope.pickedactivity) {
            return true;
          }
        }


        //retrieving stages data
        var stagesRef = ref.child('stages')
        var stagesInfo = $firebaseArray(stagesRef);
        $scope.stages = stagesInfo;

        //used to get an array of artists associated with a particular stage
        $scope.getArtist = function(stage) {
          var artist = [];

          for (var i = 0; i < $scope.artists.length; i++) {
            if ($scope.artists[i].stage == stage.stagename) {
              artist.push($scope.artists[i]);
            }
          }
          return artist;
        }


        //retrieving days data
        var daysRef = ref.child('days')
        var daysInfo = $firebaseArray(daysRef);
        $scope.days = daysInfo;


        //function called when an 'add' or 'remove' to/from schedule button is pressed for an artist
        //if previously was subscribed, then will become unsubscribed and vice versa
        $scope.changeSubscription = function(artist) {

          if (artist.subscribed) {
            artist.subscribed = false;
            artistsInfo.$save(artist);
          } else {
            artist.subscribed = true;
            artistsInfo.$save(artist);
          }
        }

        //similar to above but for activities instead of artists
        $scope.changeActivitySubscription = function(activity) {

          if (activity.subscribed) {
            activity.subscribed = false;
            activitiesInfo.$save(activity);

          } else {
            activity.subscribed = true;
            activitiesInfo.$save(activity);
          }
        }


        // Define default stage and method to change stage
        $scope.myStage = {
          stage: 'Stage 1'
        };
        $scope.chooseStage = function(chosen) {
          $scope.myStage = {
            stage: chosen
          };
        };


        // Define default day and method to change day
        $scope.myDay = {
          day: 'Friday'
        };
        $scope.chooseDay = function(chosen) {
          $scope.myDay = {
            day: chosen
          };
        };


        // Accordion for the stages page:
        // if given group is the selected group, deselect it
        // else, select the given group
        $scope.toggleGroup = function(group) {
          if ($scope.isGroupShown(group)) {
            $scope.shownGroup = null;
          } else {
            $scope.shownGroup = group;
          }
        };

        $scope.isGroupShown = function(group) {
          return $scope.shownGroup === group;
        };


      }
    });
  }])





// ---------- CODE IN THIS SECTION BELOW IS FOR FIREBASE USAGE. IT IS A SPLIT UP VERSION OF MainController ABOVE -------------



/*
.controller('ListController', ['$scope', '$firebaseArray', '$firebaseAuth','$state', function($scope, $firebaseArray, $firebaseAuth, $state) {

    // creates new Firebase reference
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authUser) {
      if (authUser) {
        var artistsRef = ref.child('artists')
        var artistsInfo = $firebaseArray(artistsRef);
        $scope.artists = artistsInfo;
        $scope.pickedartist = $state.params.bandId;

        $scope.changeSubscription = function(artist) {
            if (artist.subscribed) {
                artist.subscribed = false;
                artistsInfo.$save(artist);
            } else {
                artist.subscribed = true;
                artistsInfo.$save(artist);
            }
        }
      }
    });
}])



.controller('HomePageController', ['$scope', '$firebaseArray', '$firebaseAuth', '$state', function($scope, $firebaseArray, $firebaseAuth, $state) {

    // creates new Firebase reference
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authUser) {
      if (authUser) {
        var artistsRef = ref.child('artists')
        var artistsInfo = $firebaseArray(artistsRef);
        $scope.artists = artistsInfo;
        $scope.pickedartist = $state.params.bandId;

        var activitiesRef = ref.child('activities')
        var activitiesInfo = $firebaseArray(activitiesRef);
        $scope.activities = activitiesInfo;
        $scope.pickedactivity = $state.params.activityId;

        var stagesRef = ref.child('stages')
        var stagesInfo = $firebaseArray(stagesRef);
        $scope.stages = stagesInfo;

        $scope.changeSubscription = function(artist) {

            if (artist.subscribed) {
                artist.subscribed = false;
                artistsInfo.$save(artist);

            } else {
                artist.subscribed = true;
                artistsInfo.$save(artist);
            }
        }

        $scope.changeActivitySubscription = function(activity) {

            if (activity.subscribed) {
                activity.subscribed = false;
                activitiesInfo.$save(activity);

            } else {
                activity.subscribed = true;
                activitiesInfo.$save(activity);
            }
        }

      }
    });

}])


.controller('NowNextController', ['$scope', '$firebaseArray', '$firebaseAuth', '$state', function($scope, $firebaseArray, $firebaseAuth, $state) {

    // creates new Firebase reference
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authUser) {
      if (authUser) {
        var artistsRef = ref.child('artists')
        var artistsInfo = $firebaseArray(artistsRef);
        $scope.artists = artistsInfo;
        $scope.pickedartist = $state.params.bandId;

        var stagesRef = ref.child('stages')
        var stagesInfo = $firebaseArray(stagesRef);
        $scope.stages = stagesInfo;

        $scope.changeSubscription = function(artist) {

            if (artist.subscribed) {
                artist.subscribed = false;
                artistsInfo.$save(artist);

            } else {
                artist.subscribed = true;
                artistsInfo.$save(artist);
            }
        }

      }
    });

}])



.controller('ActivitiesController', ['$scope', '$firebaseArray', '$firebaseAuth', '$state', function($scope, $firebaseArray, $firebaseAuth, $state) {

    // creates new Firebase reference
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authUser) {
      if (authUser) {
        var activitiesRef = ref.child('activities')
        var activitiesInfo = $firebaseArray(activitiesRef);
        $scope.activities = activitiesInfo;
        $scope.pickedactivity = $state.params.activityId;

        $scope.changeActivitySubscription = function(activity) {

            if (activity.subscribed) {
                activity.subscribed = false;
                activitiesInfo.$save(activity);

            } else {
                activity.subscribed = true;
                activitiesInfo.$save(activity);
            }
        }
      }
    });
}])



.controller('StagesController', ['$scope', '$firebaseArray', '$firebaseAuth', '$state', function($scope, $firebaseArray, $firebaseAuth, $state) {



    // creates new Firebase reference
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authUser) {
      if (authUser) {
          var artistsRef = ref.child('artists')
          var artistsInfo = $firebaseArray(artistsRef);
          $scope.artists = artistsInfo;
          $scope.pickedartist = $state.params.bandId;

          var stagesRef = ref.child('stages')
          var stagesInfo = $firebaseArray(stagesRef);
          $scope.stages = stagesInfo;

          var daysRef = ref.child('days')
          var daysInfo = $firebaseArray(daysRef);
          $scope.days = daysInfo;

          $scope.changeSubscription = function(artist) {

              if (artist.subscribed) {
                  artist.subscribed = false;
                  artistsInfo.$save(artist);

              } else {
                  artist.subscribed = true;
                  artistsInfo.$save(artist);
              }
          }

          // Define default stage and method to change stage
          $scope.myFilter = {stage: 'Stage 1'};
          $scope.chooseStage = function(chosen) {
            $scope.myFilter = {stage: chosen};
          };

          $scope.mySecondFilter = {stage: 'Friday'};
          $scope.chooseStageDay = function(chosen) {
            $scope.mySecondFilter = {day: chosen};
          };



               // Accordion:
               // if given group is the selected group, deselect it
               // else, select the given group
               //
          $scope.toggleGroup = function(group) {
            if ($scope.isGroupShown(group)) {
              $scope.shownGroup = null;
            } else {
              $scope.shownGroup = group;
            }
          };

          $scope.isGroupShown = function(group) {
            return $scope.shownGroup === group;
          };

      }

    });

}])


.controller('ScheduleController', ['$scope', '$firebaseArray', '$firebaseAuth', '$state', function($scope, $firebaseArray, $firebaseAuth, $state) {

    // creates new Firebase reference
    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    auth.$onAuthStateChanged(function(authUser) {
      if (authUser) {
          var artistsRef = ref.child('artists')
          var artistsInfo = $firebaseArray(artistsRef);
          $scope.artists = artistsInfo;
          $scope.pickedartist = $state.params.bandId;

          var activitiesRef = ref.child('activities')
          var activitiesInfo = $firebaseArray(activitiesRef);
          $scope.activities = activitiesInfo;
          $scope.pickedactivity = $state.params.activityId;

          var daysRef = ref.child('days')
          var daysInfo = $firebaseArray(daysRef);
          $scope.days = daysInfo;

          $scope.changeSubscription = function(artist) {

              if (artist.subscribed) {
                  artist.subscribed = false;
                  artistsInfo.$save(artist);

              } else {
                  artist.subscribed = true;
                  artistsInfo.$save(artist);
              }
          }

          $scope.changeActivitySubscription = function(activity) {

              if (activity.subscribed) {
                  activity.subscribed = false;
                  activitiesInfo.$save(activity);

              } else {
                  activity.subscribed = true;
                  activitiesInfo.$save(activity);
              }
          }

      }

    // Define default stage and method to change stage
    $scope.myDay = {day: 'Friday'};
    $scope.chooseDay = function(chosen) {
      $scope.myDay = {day: chosen};
    };

    });

}])

*/






// ---------- CODE BELOW IS FOR DATA.JSON USAGE. NOT NECCESSARY ANYMORE -------------



/*
.controller('HomePageController', ['$scope', '$http', '$state', function($scope, $http, $state){
    $http.get('js/data.json').success(function(data) {

        $scope.artists = data.artists;
        $scope.stages = data.stages;

        $scope.pickedartist = $state.params.bandId;

        $scope.activities = data.activities;
    });
}])
*/



//this code is for the artists

/*
.controller('ListController', ['$scope', '$http', '$state', function($scope, $http, $state){
    $http.get('js/data.json').success(function(data) {
        $scope.artists = data.artists;
        $scope.pickedartist = $state.params.bandId;

    });
}])
*/



/*
//for the activities page
.controller('ActivitiesController', ['$scope', '$http', '$state', function($scope, $http, $state){
    $http.get('js/data.json').success(function(data) {
        $scope.activities = data.activities;
        $scope.pickedactivity = $state.params.activityId;

    });
}])
*/



/*
.controller('StagesController', ['$scope', '$http', '$state', function($scope, $http, $state){
    $http.get('js/data.json').success(function(data) {
        $scope.artists = data.artists;
        $scope.pickedartist = $state.params.bandId;
        $scope.stages = data.stages;
        $scope.days = data.days;
    });

    // Define default stage and method to change stage
    $scope.myFilter = {stage: 'Stage 1'};
    $scope.chooseStage = function(chosen) {
      $scope.myFilter = {stage: chosen};
    };

    $scope.mySecondFilter = {stage: 'Friday'};
    $scope.chooseStageDay = function(chosen) {
      $scope.mySecondFilter = {day: chosen};
    };

     // Accordion:
     // if given group is the selected group, deselect it
     // else, select the given group
     //
    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };

    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };
}])

*/


/*
.controller('ScheduleController', ['$scope', '$http', '$state', function($scope, $http, $state){
    $http.get('js/data.json').success(function(data) {
        $scope.artists = data.artists;
        $scope.pickedartist = $state.params.bandId;
        $scope.stages = data.stages;
        $scope.days = data.days;
    });

    // Define default stage and method to change stage
    $scope.myFilter = {stage: 'Stage 1'};
    $scope.chooseStage = function(chosen) {
      $scope.myFilter = {stage: chosen};
    };

    $scope.mySecondFilter = {stage: 'Friday'};
    $scope.chooseStageDay = function(chosen) {
      $scope.mySecondFilter = {day: chosen};
    };



    // Define default stage and method to change stage
    $scope.myDay = {day: 'Friday'};
    $scope.chooseDay = function(chosen) {
      $scope.myFilter = {day: chosen};
    };

}])
*/
