'use strict';

(function(exports){

    var userRoles = {
		none:   0, // 000
        public: 1, // 001
        user:   2, // 010
        admin:  4  // 100
    };

    exports.userRoles = userRoles;
    exports.accessLevels = {
        public: userRoles.public | // 111
                userRoles.user   | 
                userRoles.admin,   
        anon:   userRoles.public,  // 001
        user:   userRoles.user |   // 110
                userRoles.admin,                    
        admin:  userRoles.admin    // 100
    };

})(typeof exports === 'undefined'? this['routingConfig']={}: exports);


var handleGoogleClientLoad = function() {

  var $injector = angular.injector(['ng','GoogleAuth.services']);
  var InitializationService = $injector.get('InitializationService');
  var AuthenticationService = $injector.get('AuthenticationService');
 
  InitializationService.initialize().then(function() {
   
    AuthenticationService.login(true).then(
	 function(response) {
      var $scope = angular.element('body').scope();
	  
	  if(! $scope){
		console.error('Scope doesnt exist');
		
		}else{
	  
		  $scope.$apply(function() {
			$scope.user = response.user;
			
		  });
			$scope.$broadcast('initialAuthenticationMade',{status:'ok'});
		}
    },
	 function(err){
	   var $scope = angular.element('body').scope();
       $scope.$broadcast('initialAuthenticationMade',{status:'error'});
	 });
  });
};


var tryAuthenticate = function(authService,mode,callback){
	//console.log('tryAuthenticate');
	authService.login(mode).then(
		function(response){
			userAuthenticated(response.user);
			if(callback)callback();
		}
	);
}

var userAuthenticated = function(user) {
	//console.log('userAuthenticated');
      var $scope = angular.element('body').scope();
	  if(! $scope) console.error('Scope doesnt exist');
	  
      //$scope.$apply(function() {
        $scope.user = user;
		
      //});
     /* EventService.loadEvents().then(function(events) {
        $scope.$apply(function() {
          $scope.events = events;
        });
      });*/
    };

angular.module('GoogleAuth.models',[])
.factory('AuthenticationModel', function() {
  var access = routingConfig.userRoles;
 
  var authenticationModel = {
    isLoggedIn: false,
	role: access.public,
	isOwner:false,
	id:'',
    authenticationToken: {},
	status:0
  };
 
  return authenticationModel;
});

angular.module('GoogleAuth.services',['ngResource','ui.router','GoogleAuth.models'])
.service('AuthenticationService', ['$http','$q', '$rootScope',/*'$log',*/function($http,$q, $rootScope/*,$log*/) {
  var access = routingConfig.userRoles;
  var authenticationToken = {};
  var deferred = {}; // hackity hack hack
  var me=this;
  var newModel = function(){
	var $injector = angular.injector(['ng','GoogleAuth.models' ]);
	return $injector.get('AuthenticationModel');
  };
  
  this.authorize = function(accessLevel, userRole) {
			
		if(userRole === undefined)
			userRole = $rootScope.user.role;
		//$log.debug('Check authorization for Access Level:'+accessLevel + ' with User Role:' + userRole);
		var result= accessLevel & userRole;
		//$log.debug(result?'Authorization accepted':'Authorization rejected');
		return result;
			
	};
		
  this.login = function(initialLogin) {
    //console.log("try login");
    deferred = $q.defer();
    doLogin(initialLogin).then(function(response){deferred.resolve(response)},function(err){/*console.log('Error while try to authenticate:'+err.message);*/deferred.reject(err);});
    return deferred.promise;
  };
 
 this.logout = function(user){
	var d=$q.defer();
	//$log.log('Try to sign out');
	//$log.log(user);

	gapi.auth.signOut();
	var revokeUrl='https://accounts.google.com/o/oauth2/revoke?token='+user.authenticationToken.access_token;
	$.ajax({
            type: 'GET',
            url: revokeUrl,
            async: false,
            contentType: "application/json",
            dataType: 'jsonp',
            success: function(nullResponse) {
              //$log.log('User sign out');
              d.resolve({user:newModel()});
            },
            error: function(e) {
              //$log.log('error in revoke');
              //$log.log(e);
			  d.reject(e);
            }
          });
	
	
	return d.promise;
 };
 
  var doLogin = function(mode) {
    //$log.log("do login");
    var d=$q.defer();
	var handleLogin = function(authResult) {
	   //console.log("handle login");

		gapi.client.oauth2.userinfo.get().execute(function(response) {
			////console.dir(response);
			//$log.log('Auth resp code:'+response.code);
		 
			////console.log('token:'+authenticationToken.access_token);
			  if (!response.code) {
				//$log.log(authResult.status.signed_in);
			 
				authenticationToken = gapi.auth.getToken();
				//$log.log('token:'+authenticationToken.access_token);
				var model=newModel();
				model.isLoggedIn = true;
				model.isOwner=(response.id=='116763107480158322881')
				model.authenticationToken = authenticationToken; 
				model.role=access.user;
				model.details=response;
				model.id=response.id;
				
				if(ga!="undefined"){
						//$log.log('set Google Analytics Id');
						ga('set', '&uid', response.id); // Définir l'ID utilisateur à partir du paramètre user_id de l'utilisateur connecté.
					}
					////console.dir(me.model);
					$rootScope.$apply(function() {
					  d.resolve({user:model});
					});
					
				
			  }else{
				d.reject({message:'unauthorized'});
			  }
		});
	  };
	
    var opts = {
      client_id: '474879262930-7smn8osaaaq97iob9v22mmflnt2tmvh3.apps.googleusercontent.com',
	  apiKey: 'AIzaSyBav3gF1spxn-jyuUiZ_dDQ0n49lnRmByE',
      scope: 'https://www.googleapis.com/auth/plus.login '/*'https://www.googleapis.com/auth/blogger.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.readonly https://picasaweb.google.com/data/'*/,
      immediate: mode,
	  cookiepolicy:'single_host_origin' ,
    };
	
    gapi.auth.authorize(opts, handleLogin);
	return d.promise;
  };
 
  
  
  
}])
.service('InitializationService', ['$q', '$rootScope'/*,'$log',*/,function($q, $rootScope/*,$log*/) {
 
  this.initialize = function() {
    var deferred = $q.defer();
    var apisToLoad = 5;
 
    var loginCallback = function() {
      if (--apisToLoad === 0) {
        $rootScope.$apply(function() {
          //$log.log('finished loading up client libraries - should be resolving');
          deferred.resolve();
        });
      }
    };
 

    gapi.client.load('oauth2', 'v2', function(){/*$log.log('oauth v2 api loaded');*/loginCallback();});
	gapi.client.load("plus", "v1", function() {/*$log.log('google plus v1 api loaded');*/loginCallback();});
	gapi.client.load("calendar", "v3", function() {/*$log.log('google calendar v3 api loaded');*/loginCallback();});
	gapi.client.load("youtube", "v3", function() {/*$log.log('youtube v3 api loaded');*/loginCallback();});
	gapi.client.load("blogger","v3",function() {/*$log.log('blogger v3 api loaded');*/loginCallback();});
    return deferred.promise;
  };
}])

;