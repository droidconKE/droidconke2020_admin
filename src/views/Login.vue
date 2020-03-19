<template>
    <div class="col-md-4 col-md-offset-4">
		<div class="login-wrapper">
			<div class="box">
				<div class="content-wrap">
					<h4>droidconKE Admin</h4>
					<h6>Sign In</h6>
					<div id="firebaseui-auth-container"></div>
				</div>
			</div>

		</div>
	</div>
</template>
<script>
    import firebase from './../services/Firebase.js';
    var firebaseui = require('firebaseui');
    import "../../node_modules/firebaseui/dist/firebaseui.css"
export default {
    mounted() {
        let self = this
        let uiConfig = {
            signInOptions: [{
                provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID
            }],
            callbacks: {
                signInSuccessWithAuthResult() {
                    localStorage.setItem('authenticated', true)
                    self.$toast.success('Login Successful', 'Login',{position: 'topCenter'});
                    self.$router.push('/')
                }
            }
        }
        var ui = new firebaseui.auth.AuthUI(firebase.auth())
        ui.start("#firebaseui-auth-container", uiConfig)
    },
}
</script>

