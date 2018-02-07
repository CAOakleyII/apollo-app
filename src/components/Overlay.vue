<template>
    <div class="player">
        <div v-if="track" class="player__current_track">
            <img class="player__album_art" :src="track.item.album.images[0].url" />
            <div class="player__track_info">
                <div class="player__track_title">
                    {{track.item.name}} 
                    <span class="player__control-btn player__save-track" v-if="!is_saved" @click="onAddToSaved(track.item.id)"> 
                        <i class="fas fa-plus-circle"></i>
                    </span>
                    <span class="player__control-btn player__remove-track" v-if="is_saved" @click="onRemoveFromSaved(track.item.id)">                        
                        <i  class="fas fa-check-circle"></i>
                    </span>
                </div>
                <div class="player__track_artist">
                    {{track.item.artists[0].name}}
                </div>
            </div>
            <div class="player__controls">
                <div class="player__rewind player__control-btn" @click="onRewindClick">
                    <i class="fas fa-step-backward"></i>
                </div>
                <div class="player__play_pause player__control-btn" @click="onPlayPauseClick">
                    <i v-if="!track.is_playing" class="fas fa-play"></i>
                    <i v-else class="fas fa-pause"></i>
                </div>
                <div class="player__forward player__control-btn" @click="onForwardClick">
                    <i class="fas fa-step-forward"></i>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script>
import * as firebase from 'firebase';
import SpotifyWebApi from 'spotify-web-api-node';
import { setInterval, setTimeout } from 'timers';

let spotifyApi = new SpotifyWebApi();

export default {   

    name: 'Overlay',
    data () {
        return {
            keysDown: [],
            track : undefined,
            is_saved: false
        }
    },
    mounted() {
        this.$emit('toggleOverlay', true)
        window.document.onkeydown = (function(e) { 
            this.keysDown[e.keyCode] = true

            // back tick and shift
            if (this.keysDown[192] && this.keysDown[16]) {
                this.$emit('toggleTitleBar')
            }
        }).bind(this);
        
        window.document.onkeyup = (function(e) {
            delete this.keysDown[e.keyCode]
        }).bind(this);
        
        this.loadInfo()

        setTimeout(() => {
            setInterval(() => {
                this.getCurrentTrack();
            }, 500)
        }, 1000);        
    },
    methods: {
        loadInfo () {
            // get user
            let user = firebase.auth().currentUser;
            if (!user) {
                this.$router.push('/login')
                return;
            }

            if (!user.spotify) {
                this.$router.push('/home')
            }

            spotifyApi.setAccessToken(user.spotify.access_token)
            spotifyApi.setRefreshToken(user.spotify.refresh_token)            
            
            this.getCurrentTrack();
        },
        getCurrentTrack(){
            spotifyApi.getMyCurrentPlayingTrack()
            .then(resp => {

                this.track = resp.body;

                spotifyApi.containsMySavedTracks([this.track.item.id])
                    .then(resp => {                        
                        this.is_saved = resp.body[0];
                    })

            }).catch(err => {
                console.log('error: ', err)
            })
        },
        onAddToSaved(id, track) {
            spotifyApi.addToMySavedTracks([id])
            .then(() => {
                if (this.track.item.id == id) {
                    this.is_saved = true;
                }
            }).catch(err => {
                console.log('error adding to saved', err);
            })
        },
        onRemoveFromSaved(id) {
            spotifyApi.removeFromMySavedTracks([id])
            .then(() => {
                if (this.track.item.id == id) {
                    this.is_saved = false;
                }                
            }).catch(err => {
                console.log('error removing from saved', err);
            })
        },
        onRewindClick() {
            spotifyApi.skipToPrevious();
        },
        onPlayPauseClick() {
            if (this.track.is_playing) {
                spotifyApi.pause().then( () => {
                    this.track.is_playing = !this.track.is_playing;
                });                
            } else {
                spotifyApi.play().then( () => {
                    this.track.is_playing = !this.track.is_playing;
                });
            }
        },
        onForwardClick() {
            spotifyApi.skipToNext();
        }
    }
}
</script>

<style lang="less">
@import './../less/colors';

    body, html{
        background-color: rgba(0,0,0,0) !important;
    }
    .titlebar{
        position: relative !important;
    }
    .content {
        padding-top: 0;
    }
    .player{
        background-color: rgba(0, 0, 0, 0.79);
        width: 100%;
        border-radius: 0px;
        display: flex;
        &__track_info {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: 8px 5px;
        }
        &__current_track {
            display: flex;
            flex-grow: 1;
        }
        &__album_art {            
            width: 45px;
            height: 45px;       
        }
        &__track_title {
            color: white;
            font-size: 12px;
        }
        &__track_artist {
            color: @lightgray;
            font-size: 10px;
        }
        &__controls{
            display: flex;
            flex-direction: row;
            flex-grow: 1;
            justify-content: space-around;
        }
        &__control-btn {
            align-self: center;
            &:hover {
                cursor: pointer;
            }
        }
        &__save-track, &__remove-track {
            font-size: 9px;
        }
        &__save-track {
            color: white;
        }
        &__remove-track {
            color: @main;
        }
    }
</style>

