<template> 
    <div class="login">
        <div class="login__header">
        Welcome to <span class="colorize"> Apollo </span>
      </div>
      <div class="login__box">
          <div class="login__tab_row">
            <div class="login__tab">
              <span class="login__tab-title" v-bind:class="{ active : activeTab === 'login' }" @click="onTabClick('login')"> Login </span>
            </div>
            <div class="login__tab">
              <span class="login__tab-title" v-bind:class="{ active : activeTab === 'register' }" @click="onTabClick('register')"> Register </span>
            </div>
          </div>

          <form v-if="activeTab === 'login'" class="panel" v-on:submit.prevent="onLogin">
            <div class="panel__email-section">
              <div class="panel__email-title"> Email </div>
              <input class="panel__email-input" v-model="loginEmail" type="email"  name="email" placeholder="name@email.com" />
              <span class="panel__email-validation"> {{ loginEmailValidation }}</span>
            </div>
            <div class="panel__password-section">
              <div class="panel__password-title"> Password </div>
              <input class="panel__password-input" v-model="loginPassword" type="password" name="password" />
              <span class="panel__password-validation"> {{ loginPasswordValidation }} </span>
            </div>
            <div class="panel__submit-section">
              <button class="panel__submit" @click="onLogin">
                Login
              </button>
            </div>
          </form>

          <form v-if="activeTab === 'register'" class="panel" v-on:submit.prevent="onRegister">
            <div class="panel__email-section">
              <div class="panel__email-title"> Email </div>
              <input class="panel__email-input" v-model="registerEmail" type="email" name="email" placeholder="name@email.com" />
              <span class="panel__email-validation"> {{ registerEmailValidation }} </span>
            </div>
            <div class="panel__password-section">
              <div class="panel__password-title"> Password </div>
              <input class="panel__password-input" v-model="registerPassword" type="password" name="password" />
              <span class="panel__password-validation"> {{ registerPasswordValidation }} </span>
            </div>
            <div class="panel__submit-section">
              <button class="panel__submit" @click="onRegister">
                Register
              </button>
            </div>
          </form>
      </div>
    </div>
</template>

<script>
import * as firebase from 'firebase';

export default {
    name: 'Login',
    data () {
        return {
            activeTab: this.getQueryString('register') ? 'register' : 'login',
            loginEmail: '',
            loginPassword: '',
            loginEmailValidation: '',
            loginPasswordValidation: '',
            registerEmail: '',
            registerPassword: '',
            registerEmailValidation: '',
            registerPasswordValidation: ''    
        }
    },
    methods: {
        onTabClick (tab) {
            this.activeTab = tab
        },
        clearValidation () {
            this.loginEmailValidation = ''
            this.loginPasswordValidation = ''
            this.registerEmailValidation = ''
            this.registerPasswordValidation = ''
        },
        getQueryString (field) {
            var href = window.location.href
            var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i')
            var string = reg.exec(href)
            return string ? string[1] : null
        },
        onLogin () {
            this.clearValidation()
            firebase.auth().signInWithEmailAndPassword(this.loginEmail, this.loginPassword)
            .then(() => {
                this.$router.push('/')
        })
        .catch((err) => {
            if (err.code === 'auth/wrong-password') {
            this.loginPasswordValidation = 'password or username is incorrect.'
            } else if (err.code === 'auth/invalid-email') {
            this.loginEmailValidation = 'invalid email provided.'
            } else if (err.code === 'auth/user-not-found') {
            this.loginEmailValidation = 'username not found.'
            } else {
            console.log(err)
            }
        })
        },
        onRegister () {
            this.clearValidation()
            firebase.auth().createUserWithEmailAndPassword(this.registerEmail, this.registerPassword)
            .then(() => {
                this.$router.push('/')
        })
        .catch((err) => {
            if (err.code === 'auth/email-already-in-use') {
            this.registerEmailValidation = 'email address already in use.'
            } else if (err.code === 'auth/invalid-email') {
            this.loginEmailValidation = 'invalid email provided.'
            } else if (err.code === 'auth/weak-password') {
            this.loginEmailValidation = 'password does not meet requirements.'
            } else {
            console.log(err)
            }
        })
    }
  }
}
</script>


<style lang="less">

@import './../less/colors';

  .login {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: stretch;
    margin: 20px auto;
    max-width: 650px;
    padding: 0 .8rem;
    .colorize {
        color: @main;
    }
    &__header {
        text-align: center;
        font-size: 2rem;
        color: @white;
    }
    &__box {
      margin: 2rem 0;
    }
    &__tab_row {
      border-bottom: 1px solid @accent;
      padding: 1rem 0;
    }

    &__tab {
      display: inline-block;
    }

    &__tab-title {
      text-align: center;
      color: @white;
      font-weight: bolder;
      padding: .8rem;

      &:hover {
        border-bottom: 4px solid @accent;
        cursor: pointer;
      }
      &.active {
        border-bottom: 4px solid @main;
      }
    }
  }

  .panel {
    padding: 1rem 1rem;    
    color: main;
    font-weight: bold;
    font-size: .8rem;

    &___email-section, &__password-section{
      margin: 20px 0;
    }
    &__email-input, &__password-input {
      height: 40px;
      width: 100%;
      font-size: 1rem;
      padding: 0.4rem;
      border: none;
      border-bottom: 2px solid @white;      
      font-weight: bold;
      background-color: @transparent;
      outline: 0;
      color: @white;
      &::-webkit-input-placeholder {
          color: @lightgray;
          font-weight: 200;
          font-size: 12px;
          letter-spacing: 1px;
      }
    }
    &__email-validation, &__password-validation {
      color: @red;
      font-size: 0.7rem;
      margin: 0.4rem;
      display: block;
    }
    &__submit {
      background-color: @main;
      color: @white;
      border: 0;
      padding: 0.6rem;
      font-size: 0.78rem;
      font-weight: bold;
      border-radius: 0.3rem;
      cursor: pointer;
      float: right;
    }
  }

</style> 