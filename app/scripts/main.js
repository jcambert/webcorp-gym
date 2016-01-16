!function (angular) {

   "use strict";
    var app = angular.module('gymapp', []);
    
    app.run(['$rootScope',function($rootScope){
        $rootScope.login=function(){  
          $rootScope.isLoggedIn=true;
        };
        $rootScope.isLoggedIn=false;
    }]);
    
    app.directive('login',['$rootScope',function($rootScope){
        return{
            replace:true,
            restrict:'E',
            template:'<a href="#" ng-click="login()" ng-hide="isLoggedIn" class="btn btn-default btn-circle"><i class="fa fa-3x fa-user"></i></a>',
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
            template:'<div class="social"><ul class="social-share"><li ng-repeat="(key,value) in socials"><a href="#" ng-click="navigate(value)"><i class="fa fa-{{key}}"></i></a></li></ul></div>',
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
                color:'@color'
            },
            template:'<div><div ng-transclude class="thumbnail tile"></div></div>',
            link:function(scope,element,attrs){
                element.find('div').addClass("tile-"+scope.color);
            }
        }
        
    }]);
    
    app.directive('wide',[function(){
        return{
            replace:true,
            restrict:'A',
            link:function(scope,element,attrs){
                element.addClass("col-sm-6 col-md-6 col-lg-3");
                element.find('div').addClass("tile-wide");
            }
        }
    }]);
    
    app.directive('medium',[function(){
        return{
            replace:true,
            restrict:'A',
            link:function(scope,element,attrs){
                element.addClass("col-sm-3 col-md-3 col-lg-2");
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
  // Magie du contrôleur
    }]);
    
}(angular);