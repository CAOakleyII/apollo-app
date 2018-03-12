<template>
    <div id="home">
        <div class="home-nav" v-if="!user">
            <router-link class="login-link" :to="'/login'">
                Login
            </router-link>
        </div>
        <div class="home-nav" v-if="user">
            <span class="nav-item" @click="onCollapseClick"><i class="fas fa-external-link-alt fa-flip-horizontal" ></i></span>            
            <span class="logout-link nav-item" @click="onLogoutClick"> Logout </span>
        </div>
        <div class="settings" v-if="!spotifyUser&&spotifyAuthUrl">
            <a class="btn-connect-spotify" :href="spotifyAuthUrl" target="_blank"> <i class="fab fa-spotify"></i> Connect </a>            
        </div>

        <div class="settings" v-if="user&&spotifyUser">
            <span class="btn-disconnect-spotify" @click="onDisconnect"> <i class="fab fa-spotify"></i> Disconnect </span>
        </div>
    </div>
</template>

<script>

import * as firebase from 'firebase';
import SpotifyWebApi from 'spotify-web-api-node';

var scopes = ['playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-public', 'playlist-modify-private', 'streaming',
    'user-library-read', 'user-library-modify', 'user-read-email', 'user-top-read', 'user-read-playback-state', 
    'user-modify-playback-state', 'user-read-currently-playing', 'user-read-recently-played'];

var redirectUri = `${site_scheme}://${site_domain}:${site_port}/spotify/connect`
var clientId = '94daf1e6045745a48441e3eb9118649b';

var  spotifyApi = new SpotifyWebApi({
    redirectUri, clientId
});

var config = {
        apiKey: "AIzaSyCUZ0qBuc6Y4ka5lSry0C9FHioPLYSRd34",
        authDomain: "apollo-62a60.firebaseapp.com",
        databaseURL: "https://apollo-62a60.firebaseio.com",
        projectId: "apollo-62a60",
        storageBucket: "apollo-62a60.appspot.com",
        messagingSenderId: "222920486886"
      };
firebase.initializeApp(config);


export default {
    name: 'Home',
    data () {
        return {
            user: undefined,
            spotifyUser: undefined,
            spotifyAuthUrl : ''
        }
    },
    methods: {
        onCollapseClick () {
            this.$router.push('/overlay')
        },
        onLogoutClick () {
            firebase.auth().signOut().catch((error) => {
                console.log(error)
            })
        },
        onDisconnect () {            
            let tokenRef = firebase.database().ref(`/users/${this.user.uid}/spotify`);
            tokenRef.remove();
        },
        onAuthStateChanged (user) {
            // check for spotify info
            if (user) {
                let spotifyTokenRef = firebase.database().ref(`/users/${user.uid}/spotify`);
                spotifyTokenRef.on('value', (s)=>{
                    
                    let spotify = s.val();                 
                    if (!spotify || !spotify.access_token || !spotify.refresh_token) {
                        this.spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes, user.uid);
                        this.spotifyUser = undefined;
                    } else {
                        spotifyApi.setAccessToken(spotify.access_token);
                        spotifyApi.setRefreshToken(spotify.refresh_token);
                        spotifyApi.getMe()
                            .then(data => {
                                this.spotifyUser = data.body;
                            })
                            .catch(err => {
                                console.log('user could not be retrieved', err);
                                // try to refresh the access token
                                if (err.statusCode === 401) {
                                    this.$http.get(`${api_scheme}://${api_domain}:${api_port}/spotify/${user.uid}/refresh`).then(resp => {
                                        
                                    }).catch(resp => {
                                        if(!resp.status.ok) {
                                            this.spotifyAuthUrl = spotifyApi.createAuthorizeURL(scopes, user.uid);
                                        }
                                    })
                                }
                                
                                // otherwise user revoked access
                                this.spotifyUser = undefined;
                            })
                    }
                    user.spotify = spotify;
                    this.user = user;
                })
            } else {
                this.user = user;
                this.$router.push('/login')
            }    
        }
    },
    mounted() {        
        firebase.auth().onAuthStateChanged(this.onAuthStateChanged)
    }    
}
</script>

<style lang="less">
    @import './../less/colors';

    .home-nav {
        text-align: left;
        padding: 5px 15px;
    }
    .nav-item {
        color: white;
        &:hover {
            cursor: pointer;
            color: @main;
        }
    }
    .logout-link, .login-link {
        float: right;        
        font-variant: small-caps;
        text-decoration: none;        
    }
    .settings {
        text-align: center;
        margin-top: 150px;
    }
    .btn-disconnect-spotify, .btn-connect-spotify {
        border: 1px solid @main;
        padding: 3px 7px;
        border-radius: 7px;
        background-color: @main;
        color: @white;
        text-decoration: none;
        &:hover { 
            cursor: pointer;
            border: 1px solid @white;
            background-color: @white;
            color: @main;            
        }
    }
</style>
