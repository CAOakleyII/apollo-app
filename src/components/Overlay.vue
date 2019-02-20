<template>
    <div class="player">
        <div v-if="track" class="player__current_track">
            <img class="player__album_art" v-if="track.item.album.images[0]" :src="track.item.album.images[0].url" />
            <div class="player__track_info">
                <div class="player__track_title">
                    <span class="player__track_title_name"> 
                        {{track.item.name}} 
                    </span>
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
        <div class="drop-down">
            <span class="drop-down__button" @click="onDropDownClick"> 
                <i v-if="!expanded" class="fas fa-chevron-down"></i>
                <i v-if="expanded" class="fas fa-chevron-up"></i> 
            </span>
            <div v-if="expanded" class="drop-down__menu">
                <component :is="current_view"></component>
                <div class="drop-down__subNav">
                    <ul>
                        <li v-for="(view) in views" :class="{ active: current_view == view.component}" :key="view.name" @click="onSubNavViewClick(view)">
                            <i :class="view.icon" ></i>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as firebase from 'firebase';
import SpotifyWebApi from 'spotify-web-api-node';
import Search from './Search';
import Party from './Party';
import Library from './Library';
import Browse from './Browse';
import { setInterval, setTimeout } from 'timers';

let spotifyApi = new SpotifyWebApi();

export default {   

    name: 'Overlay',
    data () {
        return {
            keysDown: [],
            track : undefined,
            is_saved: false,
            expanded: false,
            views: [
                {
                    name: "Party",
                    icon: "fas fa-users",
                    component: Party
                },/*
                {
                    name: "Browse",
                    icon: "fas fa-archive",
                    component: Browse
                },
                
                {
                    name: "Search",
                    icon: "fas fa-search",
                    component: Search
                },
                {
                    name: "Library",
                    icon: "fas fa-book",
                    component: Library
                }*/
            ],
            current_view: Party
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

                if (!this.track || !this.track.item) {
                    return;
                }
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
        },
        onDropDownClick() {
            if (!this.expanded) {
                window.ipcRenderer.send('reize', {width: 300, height: window.outerHeight + 200})
                this.expanded = true;
            } else {
                window.ipcRenderer.send('reize', {width: 300, height: window.outerHeight - 200})
                this.expanded = false;
            }
        },
        onSubNavViewClick(view) {
            this.current_view = view.component;
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
    .player {
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
            z-index: 1;   
        }
        &__track_title {
            color: white;
            font-size: 12px;
            overflow-x: hidden;
            white-space: nowrap;
            width: 125px;
            text-overflow: ellipsis;   
        }
        &__track_title_name {
            width: 100px;
            -webkit-transition: 3.3s;
            -moz-transition: 3.3s;
            transition: 3.3s;
            -webkit-transition-timing-function: linear;
            -moz-transition-timing-function: linear;
            transition-timing-function: linear;
            display: inline-block;
            text-overflow: ellipsis;
            overflow: hidden;
            &:hover {
                margin-left: -100px;
                width: 200px;
            }
        }
        &__track_artist {
            color: @lightgray;
            font-size: 10px;
            overflow-x: hidden;
            white-space: nowrap;
            width: 125px;
            -webkit-transition: 3.3s;
            -moz-transition: 3.3s;
            transition: 3.3s;
            -webkit-transition-timing-function: linear;
            -moz-transition-timing-function: linear;
            transition-timing-function: linear;
            display: inline-block;
            text-overflow: ellipsis;
            overflow: hidden;
            &:hover {
                margin-left: -125px;
                width: 250px;
            }
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
                color: @main;
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
    .drop-down {
        width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        &__button {
            &:hover {
                color: @main;
                cursor: pointer;
            }
        }
        &__menu {
            position: fixed;
            height: 200px;
            width: 100%;
            left: 0;
            background-color: @lightblack;
            bottom: 0;
        }
        &__subNav {
            position: fixed;
            height: 25px;
            width: 100%;
            left: 0;
            bottom: 0;
            ul {
                list-style-type: none;
                margin: 0;
                padding: 0;
                overflow: hidden;
                text-align: center;
                border-top: 1px solid rgba(255,255,255,0.5);
                li {
                    padding-top: 2.5px;
                    width: 22%;
                    display: inline-block;
                    border-right: 1px solid rgba(255,255,255,0.5);
                    &:last-child { 
                        border-right: 0px;
                    }
                    &.active {
                        color: @main;
                    }
                    &:hover {
                        color: @accent;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>

