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
var PICASA_ID='116763107480158322881';

!function (angular,moment,_) {

   "use strict";
    var app = angular.module('gymapp', [ 
        'ngResource',
        'ui.router',
        "ngSanitize",
        'ngAnimate',
        'com.2fdevs.videogular',
        'com.2fdevs.videogular.plugins.controls',
        'com.2fdevs.videogular.plugins.overlayplay',
        'com.2fdevs.videogular.plugins.poster',
        'info.vietnamcode.nampnq.videogular.plugins.youtube',
        
        'angular.gapi',
        'angular.youtube',
        'angular.blogger',
        'angular.calendar',
        'angular.photos',
        'angular.gallery'
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
               "back":{
                   templateUrl:'partials/photo.html',
                   controller:'PhotoCtrl'
               }
           }
       })
        .state("lien",{
           url:"/lien",
           views:{
               "front":{template:'' },
               "back":{templateUrl:'partials/lien.html'}
           }
       })
       .state("admin",{
           url:"/admin",
           views:{
               "front":{template:'' },
               "back":{
                   templateUrl:'/partials/admin.html',
                   controller:'AdminCtrl'
               }
           }
       })
       
       .state("gallery",{
           url:"/gallery",
           views:{
               "front":{template:'' },
               "back":{
                   templateUrl:'/partials/gallery.html',
                   controller:'GalleryCtrl'
               }
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
         GAuth.setScope("https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/calendar.readonly  https://picasaweb.google.com/data/");
         GAuth.checkAuth().then(
            function () {
                //console.log('user identified');
                //console.log($rootScope.gapi.user.picture);
                $state.go('index');
            },
            function() {
                //console.log('User non identified');
                $state.go('index');     
                            
                }
            );
            $rootScope.isAdmin=function(){
                if($rootScope.gapi && $rootScope.gapi.login)
                    return $rootScope.gapi.user.id == '116763107480158322881';
                return false;
            };
            $rootScope.$watch('gapi.login',function(){
                if($rootScope.gapi && $rootScope.gapi.login){
                   //alert($rootScope.gapi.user.id);
                }
            });
            
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
           $scope.posts=posts; 
        });
    }]);
    
    app.controller('CalendarCtrl',['$scope','calendar.service',function($scope,$calendar){
        $calendar.getEvents(CALENDAR_ID,CALENDAR_MAXRESULTS,new Date().toISOString(),API_KEY).then(function(events){
            $scope.events=events;
        })
    }]);
    
    app.controller('PhotoCtrl',['$scope','$window','photos.service',function($scope,$window,$photos){
        var token=undefined;
        try{
            token=$window.gapi.auth.getToken().access_token;
        }catch(e){
            
        }
            
        $photos.getAlbums(PICASA_ID,token).then(function(albums){
          //  console.dir(albums);
          $scope.albums=_.filter(albums.feed.entry,function(album){
                if(album.gphoto$albumType)
                    return album.gphoto$albumType.$t!="ScrapBook" && album.gphoto$albumType.$t!="ProfilePhotos";
                return true;
          });
          console.dir($scope.albums);
        });
    }]);

    app.controller('AdminCtrl',['$scope','$window','photos.service',function($scope,$window,$photos){
        $photos.getAlbums(PICASA_ID,$window.gapi.auth.getToken().access_token).then(function(albums){
            console.dir(albums);
        });
    }]);
    
    app.controller('GalleryCtrl',['$scope','$state','$q','$http','$document',function($scope,$state,$q,$http,$document){
        var keys_codes = {
            enter : 13,
            esc   : 27,
            left  : 37,
            right : 39
        };
        
        var self=this;
        var $body = $document.find('body');
        $scope.opened=false;
        $scope.rollon=false;
        $scope.index=0;
        $scope.images=[];
        $scope.loading=false;
        $scope.$watch('index',function(){
            if(!self.canMoveTo($scope.index))return;
            self.showImage($scope.index);
        });
        $scope.$watch('images',function(){
            $scope.moveTo(0);
        });
        
        //modify dom on top for complete overlay
        $scope.$watch('opened',function(){
            
        });
        
        $scope.close = function(){
            $scope.opened=true;
        };
        $scope.previous =function(){
            if(self.hasPrevious())
                $scope.index-=1;
            else if($scope.rollon)
                $scope.index=$scope.images.length-1;
        };
        $scope.next = function(){
            if(self.hasNext())
                $scope.index+=1;
            else if($scope.rollon)
                $scope.index=0;    
        };
        $scope.moveTo = function(index){
            $scope.index=index;
        };
        self.hasNext = function(){
            return $scope.index+1<$scope.images.length;
        }
        self.hasPrevious = function(){
            return $scope.index-1<=0;
        }
        self.canMoveTo = function(index){
            return !$scope.loading && self.verifyImages() && index>=0 && index<$scope.images.length;
        };
        self.verifyImages = function(){
            return Array.isArray( $scope.images);
        };
        self.showImage = function(index){
            
            self.loadImage(index).then(
                function(resp){
                    console.dir(resp);
                    $scope.image=resp.src;
                    $scope.description=$scope.images[index].description || '';
                    $scope.loading=false;
                },
                function(error){
                    console.error(error);
                    
                }
            )
        }
        self.loadImage = function(index){
            var d=$q.defer();
             var image = new Image();

            image.onload = function () {
                $scope.loading = false;
                if (typeof this.complete === false || this.naturalWidth === 0) {
                    d.reject();
                }
                d.resolve(image);
            };
    
            image.onerror = function () {
                d.reject();
            };
            
            image.src = $scope.images[index].url;
            $scope.loading = true;
            return d.promise;
        };
        
         $body.bind('keydown', function(event) {
            if (!scope.opened) {
                return;
            }
            var which = event.which;
            if (which === keys_codes.esc) {
                scope.closeGallery();
            } else if (which === keys_codes.right || which === keys_codes.enter) {
                scope.nextImage();
            } else if (which === keys_codes.left) {
                scope.prevImage();
            }

            scope.$apply();
        });
                
        $scope.images=[
            {url:'/assets/images/bee.jpg',
            description:'papillons'},
            {url:'/assets/images/nature.jpg',
            description:'papillons'}
        ];
        $scope.opened=true;
    }]);
    
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
                

                var tpl='<tile tile-size="{{tile.size}}" color="{{tile.color}}" ng-show="($root.isAdmin() && {{tile.admin || false}}) || !{{tile.admin||false}}"><a ><h2>{{tile.title}}</h2><i class="fa fa-3x fa-{{tile.icon}}"/></a></tile>';
                var el=angular.element('<div ng-repeat="tile in tiles" ui-sref="{{tile.state}}">'+ tpl +'</div>');

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
    
    app.directive('photoGallery',[function(){
        return{
          replace:true,
          restrict:'E',
          scope:{
              albums:'=albums'
          },
          template:'<photo-tile ng-repeat="album in albums" album="album"></photo-tile>'
            
        };
    }]);
    
    app.directive('photoTile',[function(){
        return{
          repace:true,
          restrict:'E',
          scope:{
            album:'=album'  
          },
          template:/*'<div>{{album.title.$t}}<img ng-src="{{album.media$group.media$thumbnail[0].url}}"/></div>'*/ ' ' +
          '<div class="video-playlist-tile" tile-size="wide" >'+
            '<a href="#" ui-sref="video.play({videoid:videoid})">'+
                '<div class="video-tile-thumbnail " >' +
                    '<div class="video-tile-img">' +
                        '<img ng-src="{{album.media$group.media$thumbnail[0].url}}"/>' +
                    '</div>' +
                    '<div class="video-tile-description">' +
                        '<h3 >{{album.title.$t}}</h3>' +
                        '<h4>{{album.summary.$t}}</h4>' +
                   '</div>' +
                '</div>' +
            '</a>' +
        '</div>'
        };
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
            {size:'wide',color:'magenta',state:'admin',title:'Administration',icon:'tachometer',admin:true},
            {size:'medium',color:'magenta',state:'gallery',title:'Gallerie',icon:'picture-o'},
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
}(angular,moment,_);

