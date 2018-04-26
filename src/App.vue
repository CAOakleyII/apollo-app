<template>    
    <div id="app">
        <div v-show="showTitleBar" id="electron-titlebar" class="drag titlebar"><span class="title"> <img class="title-bar-logo" src="images/white_logo_transparent_inline.svg" /> </span></div>
        <div class="content">
            <router-view v-on:toggleOverlay="toggleOverlay"  v-on:toggleTitleBar="toggleTitleBar"></router-view>
        </div>
    </div>
</template>

<script>

export default {
    name: 'app',
    data () {
        return {
            showTitleBar: true
        }
    },
    methods: {
        toggleTitleBar () {            
            this.showTitleBar = !this.showTitleBar
            
            this.resizeOverlay()
        },
        toggleOverlay (isOverlay) {            
            window.ipcRenderer.send('overlay', isOverlay)

            if (isOverlay) {
                if (this.showTitleBar) {
                    window.ipcRenderer.send('reize', {width: 300, height: 75})
                } else {
                    window.ipcRenderer.send('reize', {width: 300, height: 45})
                }
            }
        },
        resizeOverlay() {
            if (this.showTitleBar) {
                window.ipcRenderer.send('reize', {width: 300, height: window.outerHeight + 30})
            } else {
                window.ipcRenderer.send('reize', {width: 300, height: window.outerHeight - 30})
            }
        }
    }
}
</script>

<style lang="less">
    @import './less/colors';

    .titlebar {
        background-color: @lightblack;
        height: 30px !important;
    }
    .title {
        padding: 6px 7px;
        display: block;
        text-align: left;
        font-size: 12px;
    }
    .title-bar-logo {
        width: 60px;
        display: inline-block;
    }
    .content {
        padding-top: 30px;
    }
    body, html {
        background-color: @lightblack;
        color: @lightgray;
        display: flex;
        flex-direction: column;
    }
</style>
