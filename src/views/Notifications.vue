<template>
    <div class="home">
    <div class="col-md-12" style="height: 520px;">
        <div class="col-md-6 col-md-offset-3 panel-primary">
           <div class="content-box-large">
                <div class="panel-heading">
                    <div class="panel-title">Push Notifications and Feeds</div>
                </div>
                <div class="panel-body">
                    <form class="form-horizontal" role="form" @submit.prevent="sendNotification()">
                        <div class="form-group">
                        <label for="inputEmail3" class="col-sm-2 control-label">Title</label>
                        <div class="col-sm-10">
                            <input v-model="form.title" type="text" class="form-control" id="inputEmail3" placeholder="Title" required>
                        </div>
                        </div>
                        <div class="form-group">
                        <label for="inputEmail3" class="col-sm-2 control-label">Target Url</label>
                        <div class="col-sm-10">
                            <input v-validate="{url: {require_protocol: true }}" data-vv-name='url' data-vv-as="url" v-model="form.url" type="text" class="form-control" id="inputEmail32" placeholder="Url" required>
                            <small class='text-danger'>{{ errors.first('url') }}</small>
                        </div>
                        </div>
                        <div class="form-group">
                        <label for="inputPassword3" class="col-sm-2 control-label">Topic</label>
                        <div class="col-sm-10">
                            <select type="password" v-model="form.topic" class="form-control" id="inputPassword3" placeholder="Topic" required>
                                <option value="">Select Topic</option>
                                <option :value="topic">All</option>
                                <option v-for='session in sessions' :key='session.id' :value="session.slug">{{session.title}}</option>
                            </select>
                        </div>
                        </div>
                        <div class="form-group">
                        <label class="col-sm-2 control-label">Message</label>
                        <div class="col-sm-10">
                            <textarea v-model="form.message"  v-validate="'max:400'" data-vv-name='message' data-vv-as="message" class="form-control" placeholder="Textarea" rows="3" required></textarea>
                            <small class='text-danger'>{{ errors.first('message') }}</small>
                        </div>
                        </div>

                        <div class="form-group">
                        <label class="col-sm-5 control-label">
                            <input type="checkbox" class="" v-model="form.checkbox" id="box">
                            Send as Feed</label>

                        </div>

                        <div v-if="form.checkbox" class="form-group">
                        <label for="inputEma2" class="col-sm-2 control-label">Image(optional)</label>
                        <div class="col-sm-10">
                            <input v-validate="'image'" data-vv-name='image' data-vv-as="image" @change="onFileChanged" type="file" accept="image/*" class="form-control" id="inputEma2" placeholder="Image" ref="fileInput">
                            <small class='text-danger'>{{ errors.first('url') }}</small>
                        </div>
                         </div>

                        <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button type="submit" class="btn btn-primary">Send</button>
                        </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return {
            form: {
                url : 'https://droidcon.co.ke',
                message: '',
                topic : '',
                title : '',
                image : null,
                checkbox: false,
            },
            sessions: [],
            instance : null
        }
    },
    mounted(){
        this.instance = this.axios.create({
            baseURL: process.env.VUE_APP_API_BASE_URL
        });

        this.instance.defaults.headers.common['Api-Authorization-Key'] = process.env.VUE_APP_API_KEY;
        this.instance.defaults.headers.common['Accept'] = 'application/json';
        // this.instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        this.instance.get("/events/"+process.env.VUE_APP_EVENT_SLUG+"/sessions?per_page=100")
        .then(response => {
            this.sessions = response.data.data
        })
    },
    computed: {

        topic(){
            return process.env.VUE_APP_MESSAGING_TOPIC
        }
    },
    methods: {
        sendNotification(){
            const jsonBody = {
                "notification": {
                    "title": this.$data.form.title,
                    "body": this.$data.form.message,
                    "icon": "https://droidcon.co.ke/images/icons/apple-icon.png",
                    "click_action": this.$data.form.url
                },
                "data": {
                    "title": "droidcon.co.ke",
                    "body": "droidconKE2022"
                },
                "to": "/topics/"+this.$data.form.topic
                }
            const headers = {
            'Authorization': 'key='+process.env.VUE_APP_SERVER_KEY,
            'Content-Type' : 'application/json'
            };
            this.axios.post('https://fcm.googleapis.com/fcm/send',jsonBody,{headers})
                // eslint-disable-next-line no-unused-vars
            .then(_response => {
                this.$toast.success('Notifications sent', 'Notifications',{position: 'topCenter'});
                if(this.form.checkbox){
                    const formData = new FormData()
                    if(this.form.image !== null){
                        formData.append('image', this.form.image, this.form.image.name)
                    }
                    formData.append('title', this.form.title);
                    formData.append('message', this.form.message);
                    formData.append('url', this.form.url);
                    formData.append('topic', this.form.topic);
                    formData.append('key', 'this-is-key');
                    this.instance.post("/events/"+process.env.VUE_APP_EVENT_SLUG+"/feed", formData, {headers: {'Content-Type': `multipart/form-data; boundary=${formData._boundary}`}})
                    .then( response => {
                        this.$toast.success(response.data.message, 'Notifications',{position: 'topCenter'});
                    })
                        // eslint-disable-next-line no-unused-vars
                    .catch(error => {
                        this.$toast.error('An Error Occurred on saving feed', 'Notifications',{position: 'topCenter'});
                    })
                }
                this.$data.form.url = 'https://droidcon.co.ke'
                this.$data.form.message = ''
                this.$data.form.topic = ''
                this.$data.form.title = ''
                this.form.image = null
                this.errors.clear()
                this.reset()
                return
                // console.log('Sent.:' ,response);
            }).catch((err) => {
                console.log('Unable to send ', err);
            });

        },
        onFileChanged (event) {
            this.form.image = event.target.files[0]
        },
        reset() {
            const input = this.$refs.fileInput
            input.type = 'text'
            input.type = 'file'
        }
    }
}
</script>

