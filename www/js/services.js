//useful resource to influence creation of the Authentication service:
//  https://www.lynda.com/AngularJS-tutorials/AngularJS-1-Adding-Registration-Your-Application/560052-2.html

angular.module('starter.services', [])

  .factory('Authentication', ['$rootScope', '$location', '$firebaseObject', '$firebaseAuth', function($rootScope, $location, $firebaseObject, $firebaseAuth) {

    var ref = firebase.database().ref();
    var auth = $firebaseAuth();

    var object;

    auth.$onAuthStateChanged(function(authUser) {
      if (authUser) {
        var userRef = ref.child('users').child(authUser.uid); //get a reference to current user
        var userObj = $firebaseObject(userRef); //stored users data into variable
        $rootScope.currentUser = userObj;
      } else {
        $rootScope.currentUser = '';
      }
    });



    object = {

      //the user's email and password is passed through. if successful,
      //then the user is allowed to pass through
      login: function(user) {
        auth.$signInWithEmailAndPassword(
          user.email,
          user.password
        ).then(function(user) {
          $location.path('/app/landingpage')
        }).catch(function(error) {
          $rootScope.message = error.message;
        })


      }, //login

      logout: function() {
        return auth.$signOut();
      }, //logout

      register: function(user) {

        auth.$createUserWithEmailAndPassword(
          user.email,
          user.password
        ).then(function(regUser) {

          //allows the users data to be passed through and store in the users table, with uid as the primary key
          var regRef = ref.child('users').child(regUser.uid).set({
            date: firebase.database.ServerValue.TIMESTAMP,
            regUser: regUser.uid,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
          });
          object.login(user);
        }).catch(function(error) {
          $rootScope.message = error.message;
        }); //createUserWithEmailAndPassword

      } //register

    }; //return

    return object;

  }]); //factory
