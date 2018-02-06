import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import Login from '../components/Login'
import Overlay from '../components/Overlay'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path:'/',
            name: 'Home',
            component: Home
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/overlay',
            name: 'Overlay',
            component: Overlay
        }
    ]
})