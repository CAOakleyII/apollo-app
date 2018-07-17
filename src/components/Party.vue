<template>
  <div class="party">
    <div v-if="!party">
      <div class="party__create"> 
        <button type="button" @click="createParty"> Create Party </button>
      </div>
      <ul class="party__list" v-if="parties.length">
        <li v-for="party in parties" :key="party.pseudonym" @click="joinParty(party.pseudonym)">
          <span class="party__name"> {{ party.name }} </span>
          <i class="party__join fas fa-sign-in-alt"></i>
        </li>
      </ul>
      <p class="party__empty" v-else> You're not a part of any parties! <br /> Create or Join one. </p>
    </div>
    <div v-else>
    </div>
  </div>
</template>

<script>

import * as firebase from 'firebase';
import netmsg from '../lib/net_msg';
import io from 'socket.io-client';

export default {
  name: 'Party',
  data () {
    return {
      server: undefined,
      socket: undefined,
      party: undefined,
      user : undefined,
      parties: []
    }
  },
  mounted() {
    let user = firebase.auth().currentUser;
    if (!user) {
        this.$router.push('/login')
        return;
    }

    if (!user.spotify) {
        this.$router.push('/home')
    }
    this.user = user;
    this.getParties()
  },
  methods: {
    getParties() {
      this.$http.get(`${api_scheme}://${api_domain}:${api_port}/parties/${this.user.uid}/my`).then(response => {
        console.log(response.body);
        this.parties = response.body
      }, response => {
        // error callback
      })
    },
    getParty(id) {
      this.$http.get(`${api_scheme}://${api_domain}:${api_port}/parties/${id}`).then(response => {
        this.party = response.body
      }, response => {
        // error retrieving partying
      })
    },
    sync() {
      this.socket.emit('sync', netmsg.pack({
        'id': this.$parent.track.item.id,
        'timestamp': this.$parent.track.timestamp, 
        'progress_ms': this.$parent.track.progress_ms
        })
      )
    },
    createParty() {
      let name = `${this.user.email.substring(0, this.user.email.lastIndexOf("@"))}'s Party`
      let body = {
        name,
        host: this.user.uid,
      }
      this.$http.post(`${api_scheme}://${api_domain}:${api_port}/parties`, body).then(response => {
        let partyId = response.body

        // upgrade connection to websockets.
        this.server = io(`${api_scheme}://${api_domain}:${api_port}`)
        this.socket = io(`${api_scheme}://${api_domain}:${api_port}/${partyId}`)

        // since the user created the party we will assume they are host.
        setTimeout(() => {
            setInterval(() => {
                this.sync();
            }, 500)
        }, 500)

        this.bindSocketEvents()        
      }, response => {
        // there was an error
      })      
    },
    joinParty(id) {
      this.socket = io(`${api_scheme}://${api_domain}:${api_port}/${id}`)

      this.bindSocketEvents()
    },
    bindSocketEvents() {
      this.socket.on('sync', this.onSync.bind(this))
      this.socket.on('queueTrack', this.onQueueTrack.bind(this))
      this.socket.on('controlMusic', this.onControlMusic.bind(this))
    }
  }
}
</script>

<style lang="less">

  @import './../less/colors';

  .party {
    &__create {
      text-align: center;
      margin: 10px;
      button {
        background-color: @main;
        color: @white;
        border: 0;
        padding: 0.4rem;
        font-size: 0.78em;
        font-weight: bold;
        border-radius: 0.3rem;
        cursor: pointer;
      }
    }
    &__list {
      list-style: none;
      margin: 0;
      padding: 0;
      width: 100%;
      li {
        margin: 3px 0;
        width: 100%;
        display: flex;
        padding: 5px 15px;
        
        &:hover { 
          cursor: pointer;
          border-top: 1px solid @accent;
          border-bottom: 1px solid @accent;
          .party__join {
            color: @main;
          }
          .party__name {
            color: @main;
          }
        }
        .party__name {
          flex-grow: 0.75;
          font-size: 0.75rem;
          align-self: center;
          text-transform: lowercase;
        }
        .party__join {
          font-size: 0.8rem;
          align-self: center;
        }
      }
    }
    &__empty {
      text-align: center;
      font-size: 0.8rem;
    }
  }
</style>
