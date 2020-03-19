import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Notifications.vue'
import firebase from './services/Firebase';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: "current",
    // eslint-disable-next-line no-unused-vars
  scrollBehavior: function(to, from, savedPosition) {
    if (to.hash) {
        return {selector: to.hash}
    } else {
        return { x: 0, y: 0 }
    }
    },
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        protected: true
        },
      component: Home
    },
    {
        path: '/login',
        name: 'login',
        component: () => import( './views/Login.vue')
      }
  ]
})

router.beforeEach((to, from, next) => {
    if(!to.meta.protected) { //route is public, don't check for authentication
        next()
    } else {  //route is protected, if authenticated, proceed. Else, login
       firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                next()
            } else {
                console.log('me')
                // next('/login')
                window.location.href = '/login'
            }
        })
    }
  });

  export default router;
