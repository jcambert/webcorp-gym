

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
                    console.dir(p);
                    d.resolve(p); 
                });
               
                    
            }
            
            return d.promise;
       }
   }]);
   
}(angular,gapi);