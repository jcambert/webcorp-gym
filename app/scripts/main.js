!function (angular) {

   "use strict";
    var app = angular.module('gymapp', [ 'ngResource','ui.router','GoogleAuth.services','GoogleAuth.models']);
    
    app.config(['$stateProvider','$urlRouterProvider',function($state,$route){
       $route.otherwise("/");
       
       $state
       .state("index",{
           url:"/",
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

    app.run(['$rootScope','AuthenticationModel','AuthenticationService',function($rootScope,authModel,auth){
        $rootScope.login=function(){  
           tryAuthenticate(auth,false,function(){
               $rootScope.isLoggedIn=true;
           })
          
        };
        $rootScope.isLoggedIn=false;
    }]);
    
    app.directive("page",[function(){
        return{
            replace:true,
            restrict:'E',
            transclude:true,
            templateUrl:'partials/page.html'
        }
    }]);
    
    app.directive("deferredCloak", [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {       
                attrs.$set("deferredCloak", undefined);
                element.removeClass("deferred-cloak");
            }
        };
    }]);
    
    app.directive('home',[function(){
        return{
            replace:true,
            restrice:'E',
            template:'<a href="#" ui-sref="index" class="home"><i class="fa fa-home fa-5x"></i></a>'
            
        }
    }]);
    
    app.directive('logo',['$compile',function($compile){
        return{
            replace:true,
            restrict:'E',
            link:function(scope,element,attr){
                var el=angular.element('<a class="navbar-brand pull-left logo" ><img alt="logo"></a>');
                if('view' in attr){
                    el.attr('ui-sref',attr['view']);
                }
                if('image' in attr){
                    el.find('img').attr('src',attr['image']);
                }
                element.html(el);
                $compile(el)(scope);
            }
        }
    }])
    
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
    
    app.directive('tiles',['$compile',function($compile){
        return{
            replace:true,
            
            restrict:'E',
            link:function(scope,element,attr){
                
                //if(scope.tiles==undefined)return;
                console.log('tiles');
                console.dir(scope);
                var tpl='<tile><a href="#"><h2></h2><i class="fa fa-3x"/></a></tile>';
                var el=angular.element('<div></div>');
                _.map(scope.tiles,function(tile){
                    console.dir(tile);
                     var html=angular.element('<tile '+tile.size+' color="'+tile.color+'" ui-sref="'+tile.state+'"></tile');
                                          
                     var a=angular.element('<a href="#"></a>');
                     a.append('<h2>'+tile.title+'</h2>');
                     a.append('<i class="fa fa-3x fa-'+tile.icon+'"/>');
                     
                     html.append(a);
                     el.append(html);
                });
                element.html(el);
                $compile(el)(scope);
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
    
    app.controller('TilesCtrl',['$scope',function($scope){
        $scope.tiles=[
            {size:'wide',color:'amethyst',state:'qui',title:'Qui sommes-nous?',icon:'heart'},
            {size:'medium',color:'pink',state:'rejoindre',title:'Rejoindre',icon:'user-plus'},
            {size:'medium',color:'magenta',state:'action',title:'Actions',icon:'trophy'},
            {size:'wide',color:'asbestos',state:'actu',title:'Actualités',icon:'newspaper-o'},
            {size:'wide',color:'wisteria',state:'agenda',title:'Agenda',icon:'calendar'},
            {size:'wide',color:'magenta',state:'video',title:'Vidéos',icon:'youtube'},
            {size:'wide',color:'teal',state:'photo',title:'Photos',icon:'picture-o'},
            {size:'wide',color:'turquoise',state:'lien',title:'Liens',icon:'external-link'},
            ];
        
        
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
}(angular,_);