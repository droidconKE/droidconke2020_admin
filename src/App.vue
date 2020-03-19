<template>
  <div id="app">
      <div v-if="path === '/login' ">
        <br><br><br><br><br><br>
        <router-view/>
    </div>
    <div v-else >
    <div class="header">
     <div class="container">
        <div class="row">
           <div class="col-md-10 col-sm-9">
              <!-- Logo -->
              <div class="logo">
                 <h1><router-link to="/"> <img width='100' src="/assets/images/logo.png" alt="logo"> </router-link></h1>
              </div>
           </div>

           <div class="col-md-2 col-sm-3">
              <div class="navbar navbar-inverse" role="banner">
                  <ul class="nav navbar-nav">
                      <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">My Account <b class="caret"></b></a>
                        <ul class="dropdown-menu animated fadeInUp">
                          <li><a href="#" @click='logout()'>Logout</a></li>
                        </ul>
                      </li>
                    </ul>
              </div>
           </div>
        </div>
     </div>
	</div>

    <div class="page-content">
    <div class="row">
      <div class="col-md-2">
        <div class="sidebar content-box" style="display: block;">
            <ul class="nav">
                <!-- Main menu -->
                <li :class="[ path === '/' ? 'current' : '']"><router-link to="/"><i class="glyphicon glyphicon-bell"></i> Push Notifications</router-link></li>

            </ul>
         </div>
      </div>
      <div class="col-md-10">
        <div class="row">
               <router-view/>
        </div>
      </div>
    </div>
    </div>

    <footer>
         <div class="container">
         
            <div class="copy text-center">
               Copyright 2020 <a target="_blank" href='https://droidcon.co.ke'>droidconKE</a>
            </div>
            
         </div>
    </footer>
    </div>
  </div>
</template>
<script>
import firebase from './services/Firebase.js';
export default {
    data(){
        return {
            path : '/'
        }
    },
    updated() {
         var currentUrl = this.$router.currentRoute.path;
            // var currentUrl = window.location.pathname;
            // console.log(currentUrl)
            this.path =  currentUrl
    },
    methods: {
        logout(){
            firebase.auth().signOut().then(() => {
            localStorage.setItem('authenticated', false)
            // this.$router.push('/login')
            window.location.href = '/login'
            })
        }
    },
}
</script>

<style lang="scss">

</style>
