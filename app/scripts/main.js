!function (angular) {

   "use strict";
    var app = angular.module('gymapp', ['ui.router']);
    
    app.config(['$stateProvider','$urlRouterProvider',function($state,$route){
       $route.otherwise("/");
       
       $state
       .state("index",{
           url:"",
           views:{
               "front":{templateUrl:'partials/index.html'},
               "back":{template:''}
           }
       })
       .state("qui",{
           url:"/qui",
           views:{
               "front":{templateUrl:'partials/index.html'},
               "back":{templateUrl:'partials/qui.html'}
           }
       })
        .state("rejoindre",{
           url:"/rejoindre",
           views:{
               "front":{templateUrl:'partials/index.html'},
               "back":{templateUrl:'partials/rejoindre.html'}
           }
       })
        .state("action",{
           url:"/action",
           views:{
               "front":{templateUrl:'partials/index.html'},
               "back":{templateUrl:'partials/action.html'}
           }
       })
        .state("actu",{
           url:"/actu",
           views:{
               "front":{templateUrl:'partials/index.html'},
               "back":{templateUrl:'partials/actu.html'}
           }
       })
        .state("agenda",{
           url:"/agenda",
           views:{
               "front":{templateUrl:'partials/index.html'},
               "back":{templateUrl:'partials/agenda.html'}
           }
       })
        .state("video",{
           url:"/video",
           views:{
               "front":{templateUrl:'partials/index.html'},
               "back":{templateUrl:'partials/video.html'}
           }
       })
        .state("photo",{
           url:"/photo",
           views:{
               "front":{templateUrl:'partials/index.html'},
               "back":{templateUrl:'partials/photo.html'}
           }
       })
        .state("lien",{
           url:"/lien",
           views:{
               "front":{templateUrl:'partials/index.html'},
               "back":{templateUrl:'partials/lien.html'}
           }
       })
       ;
    }]);

    app.run(['$rootScope',function($rootScope){
        $rootScope.login=function(){  
          $rootScope.isLoggedIn=true;
        };
        $rootScope.isLoggedIn=false;
    }]);
    
    app.directive("deferredCloak", function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {       
                attrs.$set("deferredCloak", undefined);
                element.removeClass("deferred-cloak");
            }
        };
    });
    
    app.directive('login',['$rootScope',function($rootScope){
        return{
            replace:true,
            restrict:'E',
            template:'<a href="#" ng-click="login()" ng-hide="isLoggedIn" class="login"><i class="fa fa-3x fa-user"></i></a>',
        }
    }]);
    
    app.directive('user',[function(){
        return{
            replace:true,
            restrict:'E',
            template:'<span ng-show="isLoggedIn" style="color:#fff;margin-top:10px">Bonjour Jean-Christophe</span>'
        }
    }]);

    app.directive('socials',['configuration',function(config){
        return{
            replace:true,
            transclude:true,
            restrict:'E',
            template:'<div ng-repeat="(key,value) in socials"><a href="#" ng-click="navigate(value)" class="social"><i class="fa fa-2x fa-{{key}}"></i></a></div>',
            controller:function($scope){
                $scope.navigate=function(url){
                    window.open(url,'_blank');
                }
                 $scope.socials=config.socials;
            }
        }
        
    }]);
    
    app.directive('tile',[function(){
        return{
            replace:true,
            transclude:true,
            restrict:'E',
            scope:{
                color:'@color',
                state:'='
            },
            template:'<div ><div ng-transclude class="thumbnail tile"></div></div>',
            link:function(scope,element,attrs){
                element.find('div').addClass("tile-"+scope.color);
                if('state' in attrs)
                    scope.state=attrs['state'];
                else  
                    scope.state="index";
            }
        }
        
    }]);
    
    app.directive('wide',[function(){
        return{
            replace:true,
            restrict:'A',
            link:function(scope,element,attrs){
                element.addClass("col-xs-12 col-sm-4 col-md-6 col-lg-4");
                element.find('div').addClass("tile-wide");
               
            }
        }
    }]);
    
    app.directive('medium',[function(){
        return{
            replace:true,
            restrict:'A',
            link:function(scope,element,attrs){
                element.addClass("col-xs-6 col-sm-2 col-md-3 col-lg-2");
                element.find('div').addClass("tile-medium");
                
            }
        }
    }]);
    

    
    app.service('configuration',[function(){
        this.socials={
                    'facebook': 'https://www.facebook.com/avenirgrandvillars',
                    'google-plus':'https://plus.google.com/u/0/+AvenirGrandvillars',
                    'youtube':'https://www.youtube.com/user/AvenirDeGrandvillars'
                    };    
    }]); 
    
    
    
    app.controller('MainCtrl', ['$scope', function ($scope) {
       
        $scope.flipped=true;
        $scope.flip = function() {
           console.log('flip!');
            $scope.flipped = !$scope.flipped;
        };
        
         $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
             console.log('want flipping');
            $scope.flip(); 
            console.log(toState);
        });
    }]);
    
    
    app.directive("flipper", function($rootScope, $timeout) {
            return {
                restrict: "E",
                template: '<div class="flipper " ng-transclude ng-class="{ flipped: flipped }"></div>',
                transclude: true,
                scope: {
                    flipped: "="
                }
            };
        });
        
        app.directive("front",['$compile', function($compile) {
            return {
                restrict: "E",
                scope:{
                    view:'='
                },
                template: "<div class='front tileflip' ui-view='{{view}}' ></div>",
                transclude: true,
                link:function(scope,element,attrs){
                    scope.view=attrs['view'];
                }
                
            };
        }]);
        
        app.directive("back", function() {
            return {
                restrict: "E",
                scope:{
                    view:"="
                },
                template: "<div class='back tileflip' ui-view='{{view}}' ></div>",
                transclude: true,
                link:function(scope,element,attrs){
                    scope.view=attrs['view'];
                }
            }
        });  
}(angular);