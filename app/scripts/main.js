var CLIENT_KEY = '474879262930-7smn8osaaaq97iob9v22mmflnt2tmvh3.apps.googleusercontent.com';
var API_KEY='AIzaSyBav3gF1spxn-jyuUiZ_dDQ0n49lnRmByE';
var CHANNEL_ID='UCoCCSXjx4rTME6jpdYCj4XQ';
var BLOG_ID='6187643531186496547';
var QUI_ID='3446268919979638524';
var REJOINDRE_ID='4204893462561567543';
var ACTION_ID='5730449397571324216';
var ACTU_MAXRESULTS=10;
var CALENDAR_ID='gym.grandvillars@gmail.com';
var CALENDAR_MAXRESULTS=10;

!function (angular,moment) {

   "use strict";
    var app = angular.module('gymapp', [ 
        'ngResource',
        'ui.router',
        "ngSanitize",
        'ngAnimate',
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.overlayplay",
        "com.2fdevs.videogular.plugins.poster",
        "info.vietnamcode.nampnq.videogular.plugins.youtube",
        
        "angular.gapi",
        "angular.youtube",
        "angular.blogger",
        "angular.calendar"
    ]);
    
    app.config(['$stateProvider','$urlRouterProvider','$locationProvider',function($state,$route,$locationProvider){
       $route.otherwise("/");
       
       $state
       .state("index",{
           url:"/",
           views:{
               "front":{templateUrl:'partials/index.html'},
               "back":{template:''}
           }
       })
       .state("post",{
           url:"/post/:postid",
           views:{
               "front":{template:'' },
               "back":{
                   templateUrl:'partials/post.html',
                   controller:'PostCtrl',
                   
                }
           }
       })
       
     /*  .state("qui",{
           url:"/qui",
           views:{
               "front":{template:'' },
               "back":{
                   templateUrl:'partials/qui.html',
                   controller:'QuiCtrl'
                }
           }
       })
        .state("rejoindre",{
           url:"/rejoindre",
           views:{
               "front":{template:'' },
               "back":{templateUrl:'partials/rejoindre.html'}
           }
       })
        .state("action",{
           url:"/action",
           views:{
               "front":{template:'' },
               "back":{templateUrl:'partials/action.html'}
           }
       })*/
        .state("actu",{
           url:"/actu",
           views:{
               "front":{template:'' },
               "back":{
                   templateUrl:'partials/actu.html',
                   controller:'PostsCtrl'
                   }
           }
       })
        .state("agenda",{
           url:"/agenda",
           views:{
               "front":{template:'' },
               "back":{
                   templateUrl:'partials/agenda.html',
                   controller:'CalendarCtrl'
               }
           }
       })
        .state("video",{
           url:"/video",
           views:{
               "front":{template:'' },
               "back":{templateUrl:'/partials/video.html'}
           }
       })
       
       .state("video.playlists",{
           url:"/playlists",
           templateUrl:'/partials/video.playlists.html',
       })
       
       .state("video.playlist",{
           url:"/playlist/:playlistid",
           templateUrl:'/partials/video.playlist.html',
           controller:'VideoPlaylistCtrl'
           
       })
       
       .state("video.play",{
           url:'/play/:videoid',
           templateUrl:'/partials/video.play.html',
           controller:'VideoPlayerCtrl',
           controllerAs:'controller'
       })
       
        .state("photo",{
           url:"/photo",
           views:{
               "front":{template:'' },
               "back":{templateUrl:'partials/photo.html'}
           }
       })
        .state("lien",{
           url:"/lien",
           views:{
               "front":{template:'' },
               "back":{templateUrl:'partials/lien.html'}
           }
       })
       .state("temp",{
           url:"/temp",
           views:{
               "front":{template:'' },
               "back":{templateUrl:'/partials/temp.html'}
           }
       })
       ;
       
       //check browser support
        if(window.history && window.history.pushState){
            //$locationProvider.html5Mode(true); will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">

         // to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase

         // if you don't wish to set base URL then use this
         $locationProvider.html5Mode({
                 enabled: true,
                 requireBase: false
          });
        }
    }]);

    app.run(['$rootScope','$state','GApi', 'GAuth','youtube.service',function($rootScope,$state,GApi, GAuth,youtube){
         
         GAuth.setClient(CLIENT_KEY);
         GApi.load('oauth2', 'v2');
         GApi.load('youtube','v3');
         GAuth.setScope("https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/calendar.readonly");
        /* GAuth.checkAuth().then(
            function () {
                console.log('user identified');
                console.log($rootScope.gapi.user.picture);
                $state.go('index');
            },
            function() {
                console.log('User non identified');
                $state.go('index');     
                            
                }
            );*/
            
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            
                if(toState.name=='video.playlists'){
                    youtube.getPlaylists(CHANNEL_ID,API_KEY, {part:'snippet'}).then(
                        function(playlists){
                            $rootScope.playlists=playlists;
                             console.dir($rootScope.playlists);
                             //$rootScope.$apply();
                        },
                        function(){
                            console.log('Playlist not retrieved');
                        }
                    );
                   
                }else if(toState.name=='video.playlist'){
                    console.dir(toState);
                    //youtube.getPlaylistItems();
                }
                
            });
         console.log('running...');
         
    }]);
    
    
     app.controller('MainCtrl', ['$scope','GAuth', '$state', function ($scope, GAuth, $state) {
       
        $scope.flipped=true;
        $scope.flip = function() {
            $scope.flipped = !$scope.flipped;
        };
        
         $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if( fromState.name=='video.playlists' && toState.name=="video.playlist")return;
            if( fromState.name=='video.playlist' && toState.name=="video.play")return;
            $scope.flip(); 
        });
        
         $scope.doSignup = function() {
            GAuth.login().then(function(){
                
                $state.go('index'); 
            }, function() {
                console.log('login fail');
            });
        };
        
        $scope.doSignout = function(){
            GAuth.logout().then(function(){
               console.log('user is log out'); 
            });
        }
    }]);
    
    app.controller('PostCtrl',['$scope','$stateParams','$sce','blogger.service',function($scope,$stateParams,$sce,$blogger){
        $scope.loaded=false;
        $scope.postid=$stateParams.postid;
        //console.log('want read post:'+$scope.postid);
         $blogger.getPost(BLOG_ID,$scope.postid,API_KEY).then(function(post){
            $scope.post=$sce.trustAsHtml( post.content);
             $scope.title=$sce.trustAsHtml(post.title);
             $scope.loaded=true;
        });
    }]);
    
    app.controller('PostsCtrl',['$scope','$stateParams','$sce','blogger.service',function($scope,$stateParams,$sce,$blogger){
        $blogger.getPosts(BLOG_ID,ACTU_MAXRESULTS,API_KEY).then(function(posts){
           //console.dir(posts);
           $scope.posts=posts; 
        });
    }]);
    
    app.controller('CalendarCtrl',['$scope','calendar.service',function($scope,$calendar){
        $calendar.getEvents(CALENDAR_ID,CALENDAR_MAXRESULTS,new Date().toISOString(),API_KEY).then(function(events){
            $scope.events=events;
        })
    }]);
  /*  app.controller('QuiCtrl',['$scope','$sce','blogger.service',function($scope,$sce,$blogger){
        $blogger.getPost(BLOG_ID,QUI_ID,API_KEY).then(function(post){
            $scope.post=$sce.trustAsHtml( post.content);
            
        });
        
    }]);*/
    
    app.directive("page",[function(){
        return{
            replace:true,
            restrict:'E',
            transclude:true,
            scope:{
                title:'@title',
                postid:'@postid'
            },
            templateUrl:'partials/page.html'
        }
    }]);
    
    app.directive("pageHead",[function(){
        return{
            replace:true,
            restrict:'E',
            require:'^page',
            template:''
        }
    }]);
    
    app.directive("pageContent",[function(){
        return{
            replace:true,
            restrict:'E',
            require:'^page',
            template:''
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
            template:'<a href="#" ng-click="doSignup()" ng-hide="gapi.user!=undefined" class="login"><i class="fa fa-3x fa-user"></i></a>',
            
        }
    }]);
    
    app.directive('follow',['$compile',function($compile){
        return{
            replace:'true',
            restrict:'E',
           
            //template:'<div class="g-follow" data-annotation="bubble" data-height="24" data-href="//plus.google.com/u/0/116763107480158322881" data-rel="publisher"></div>',
            link:function(scope,element,attr){
                var tpl=angular.element('<div class="g-follow" data-annotation="bubble" data-height="24" data-href="//plus.google.com/u/0/'+attr['who']+'" data-rel="publisher"></div>');
                
                element.html(tpl);
                $compile(tpl)(scope);
            }
        }
        
    }]);
    
    app.directive('user',[function(){
        return{
            replace:true,
            restrict:'E',
            template:'<a href="#" ng-click="doSignout()" ng-if="gapi.user!=undefined" class="user"><img ng-src="{{gapi.user.picture}}"/></a>'
        }
    }]);

    app.directive('socials',['configuration',function(config){
        return{
            replace:true,
            transclude:true,
            restrict:'E',
            template:'<div ng-repeat="(key,value) in socials" ><a href="#" ng-click="navigate(value)" class="social"><i class="fa fa-2x fa-{{key}}"></i></a></div>',
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
                //console.log('tiles');
                //console.dir(scope);
                var tpl='<tile tile-size="{{tile.size}}" color="{{tile.color}}"><a ><h2>{{tile.title}}</h2><i class="fa fa-3x fa-{{tile.icon}}"/></a></tile>';
                var el=angular.element('<div ng-repeat="tile in tiles" ui-sref="{{tile.state}}">'+ tpl +'</div>');
               /* _.map(scope.tiles,function(tile){
                    console.dir(tile);
                     var html=angular.element('<tile '+tile.size+' color="'+tile.color+'"></tile');
                                          
                     var a=angular.element('<a href="#"></a>');
                     a.attr('ui-sref',tile.state);
                     a.append('<h2>'+tile.title+'</h2>');
                     a.append('<i class="fa fa-3x fa-'+tile.icon+'"/>');
                     
                     html.append(a);
                     el.append(html);
                });*/
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
    
    app.directive('videoPlaylists',[function(){
        return{
            replace:true,
            restrict:'E',
            scope:{
                playlists:'=playlists',
                size:'@size'
            },
            template:'<video-playlist ng-repeat="playlist in playlists" tile-size="wide" title="{{playlist.snippet.title}}" description="{{playlist.snippet.description}}" img="{{playlist.snippet.thumbnails.medium.url}}" playlistid="{{playlist.id}}"></video-playlist>',
           
        }
    }]);
    
    
    app.directive('videoPlaylist',[function(){
        return{
            replace:true,
            restrict:'E',
            scope:{
                title:'@title',
                description:'@description',
                img:'@img',
                size:'@size',
                playlistid:'@playlistid'
            },
            //template:'<div><div  class="thumbnail tile"><h4>{{title}}</h4><h5>{{description}}</h5><img ng-src="{{img}}"</div></div>'
            templateUrl:'/partials/video.playlist.tile.html'
        }
        
    }]);
    
    app.directive('videoPlaylistItems',[function(){
        return{
            replace:true,
            restrict:'E',
            scope:{
                playlistitems:'=playlistitems',
                size:'@size'
            },
            template:'<div><div ng-repeat="item in playlistitems.items"><video-playlist-item videoid="{{item.snippet.resourceId.videoId}}" title="{{item.snippet.title}}" description="{{item.snippet.description}}" img="{{item.snippet.thumbnails.medium.url}}"/></div></div>'
            
        }
    }]);
    
    app.directive('videoPlaylistItem',[function(){
        return{
            replace:true,
            restrict:'E',
            scope:{
                videoid:'@videoid',
                title:'@title',
                description:'@description',
                img:'@img'
            },
            templateUrl:'/partials/video.playlistitem.tile.html'
           // template:'<div>{{videoid}}</div>'
        }
    }]);
    
    app.directive('tileSize',[function(){
        return{
            replace:true,
            restrict:'A',
            link:function(scope,element,attr){
                if(attr.tileSize=='wide'){
                    element.addClass("col-xs-12 col-sm-4 col-md-6 col-lg-4");
                    element.find('div').addClass("tile-wide");
                }else  if(attr.tileSize=='medium'){
                    element.addClass("col-xs-6 col-sm-2 col-md-3 col-lg-2");
                    element.find('div').addClass("tile-medium");
                }
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
                    'youtube':'https://www.youtube.com/user/AvenirDeGrandvillars',
                    'ioxhost':'http://avenirgrandvillars.blogspot.fr/'
                    };    
    }]); 
    
    
    
   
    
    app.controller('TilesCtrl',['$scope',function($scope){
        $scope.tiles=[
            {size:'wide',color:'amethyst',state:'post({postid:"'+QUI_ID+'"})',title:'Qui sommes-nous?',icon:'heart'},
            {size:'medium',color:'pink',state:'post({postid:"'+REJOINDRE_ID+'"})',title:'Rejoindre',icon:'user-plus'},
            {size:'medium',color:'magenta',state:'post({postid:"'+ACTION_ID+'"})',title:'Actions',icon:'trophy'},
            {size:'wide',color:'asbestos',state:'actu',title:'Actualités',icon:'newspaper-o'},
            {size:'wide',color:'wisteria',state:'agenda',title:'Agenda',icon:'calendar'},
            {size:'wide',color:'magenta',state:'video.playlists',title:'Vidéos',icon:'youtube'},
            {size:'wide',color:'teal',state:'photo',title:'Photos',icon:'picture-o'},
            {size:'wide',color:'turquoise',state:'lien',title:'Liens',icon:'external-link'},
           // {size:'wide',color:'magenta',state:'temp',title:'Vidéos',icon:'youtube'},
            ];
        
        
    }]);
    app.directive("flipper", ['$rootScope','$timeout',function($rootScope, $timeout) {
            return {
                restrict: "E",
                template: '<div class="flipper " ng-transclude ng-class="{ flipped: flipped }"></div>',
                transclude: true,
                scope: {
                    flipped: "="
                }
            };
        }]);
        
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
        
        app.directive("back", [function() {
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
        }]);  
        
        app.controller('VideoCtrl',
		["$sce",'$rootScope', function ($sce,$rootScope) {
			
		}]
	);
    
    app.controller('VideoPlaylistCtrl',['$scope','$stateParams','youtube.service',function($scope,$stateParams,youtube){
       console.dir($stateParams);
        var playlistid=$stateParams.playlistid;
        youtube.getPlaylistItems(playlistid,API_KEY, {part:'snippet'}).then(function(videos){
           $scope.playlistitems=videos; 
           console.log('items');
           console.dir($scope.playlistitems);
        });
    }]);
    
    app.controller('VideoPlayerCtrl',['$scope','$stateParams','$sce',function($scope,$stateParams,$sce){
        console.log('VideoPlayerCtrl initilized: '+$stateParams.videoid);
        this.config = {
            	preload: "none",
				sources: [
					{src: "https://www.youtube.com/watch?v="+$stateParams.videoid},
				],
				
				theme: "../../bower_components/videogular-themes-default/videogular.css",
				/*plugins: {
					poster: "http://www.videogular.com/assets/images/videogular.png"
				}*/
                plugins: {
					controls: {
						autoHide: true,
						autoHideTime: 5000
					}
				}
			};
    }]);
    
    app.filter('moment', function () {
		return function (dt,format) {
			return moment(dt).locale("fr").format(format);
		}
    });
}(angular,moment);