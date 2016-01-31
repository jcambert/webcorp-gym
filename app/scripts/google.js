

!function (angular,gapi) {

   "use strict";
   var youtube=angular.module('angular.youtube', []);
   
   youtube.run(['$rootScope','youtube.service',function($rootScope,$service){
       console.log('youtube module running');
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
           // console.log(toState);
            if(toState.name!='video')return;
            console.log('youtube video initialization');
           //$service.getPlaylists(CHANNEL_ID,API_KEY, {part:'snippet'})
        });
       
   }]);
   
   youtube.factory('playlists',['$resource',function($resource){
    return $resource('https://www.googleapis.com/youtube/v3/playlists?part=:snippet&channelId=:channelId&key=:key');
       
   }]);
   
   youtube.factory('playlistItems',['$resource',function($resource){
    return $resource('https://www.googleapis.com/youtube/v3/playlistItems?part=:snippet&playlistId=:playlistId&key=:key');
       
   }]);
   
   youtube.service('youtube.service',['$rootScope','$http', '$q','playlists','playlistItems',function($rootScope,$http,$q,playlists,playlistItems){
      // var gapi=$rootScope.gapi;
       //console.dir(gapi);
       
        this.getPlaylists = function(channel,key,options){
            var d=$q.defer();
		    if($rootScope.gapi.login){
                    var request = gapi.client.youtube.playlists.list(options);
                    request.execute(function(resp){
                    if(resp.items)d.resolve(resp.items);
                        d.reject({});
                    });
            }else{
                playlists.get({snippet:options.part ||'snippet',channelId:channel,key:key},function(p){
                    console.dir(p);
                    d.resolve(p); 
                });
               
                    
            }
            
            return d.promise;
       }
       
       this.getPlaylistItems = function(playlist,key,options){
            var d=$q.defer();
		    if($rootScope.gapi.login){
                   //var request = gapi.client.youtube.playlists.list(options);
                    request.execute(function(resp){
                    if(resp.items)d.resolve(resp.items);
                        d.reject({});
                    });
            }else{
                playlistItems.get({snippet:options.part ||'snippet',playlistId:playlist,key:key},function(p){
                   //console.dir(p);
                    d.resolve(p); 
                });
               
                    
            }
            
            return d.promise;
       }
   }]);
  
   
   
   
   var blogger=angular.module('angular.blogger',[]);
    blogger.factory('post',['$resource',function($resource){
        return $resource('https://www.googleapis.com/blogger/v3/blogs/:blogid/posts/:postid?key=:key');   
    }]);
    blogger.factory('posts',['$resource',function($resource){
        return $resource('https://www.googleapis.com/blogger/v3/blogs/:blogid/posts?maxResults=:maxresults&orderBy=published&key=:key');   
    }]);
   
   
   blogger.service('blogger.service',['$q','post','posts',function($q,$post,$posts){
       
       this.getPost = function(blogId,postId,key){
           var d=$q.defer();
           $post.get({blogid:blogId,postid:postId,key:key},function(p){
               d.resolve(p);
           });
           return d.promise;
       };
       
       this.getPosts = function(blogId,maxResults,key){
         var d=$q.defer();
         $posts.get({blogid:blogId,maxresults:maxResults,key:key},function(p){
             d.resolve(p.items);
         });
         return d.promise;
       };
       
   }]);
   
   var calendar=angular.module('angular.calendar',[]);
   calendar.factory('events',['$resource',function($resource){
        return $resource('https://www.googleapis.com/calendar/v3/calendars/:calendarid/events?timeMin=:timemin&maxResults=:maxresults&fields=description%2Citems&key=:key');   
    }]);
    
    calendar.service('calendar.service',['$q','events',function($q,$events){
       this.getEvents = function(calendarId,maxResults,timeMin,key){
            var d=$q.defer();
            $events.get({calendarid:calendarId,maxresults:maxResults,timemin:timeMin,key:key},function(p){
               d.resolve(p.items); 
            });
            return d.promise;
       };
    }]);
   
   
   var photos=angular.module('angular.photos',[]);

   photos.service('photos.service',['$q','$http',function($q,$http){
        var self=this;
        self.url='https://picasaweb.google.com/data/feed/api/user/:userid?alt=json&kind=album&callback=JSON_CALLBACK';
        this.getAlbums= function(userid,token){
            var _url=self.url;
            if(token)
                _url+='&access_token=:token';
            _url=_url.replace(':userid',userid).replace(':token',token);

           return self.load(_url);
        }
       
        self.load = function(url) {
            var d = $q.defer();
            $http.jsonp(url ).success(function(data, status) {
                console.dir(data);
                d.resolve(data);
            });
            return d.promise;
        }
   }]);
}(angular,gapi);