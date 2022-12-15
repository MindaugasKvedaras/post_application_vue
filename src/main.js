import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vueDebounce from 'vue-debounce'

Vue.prototype.$apiUrl = "http://localhost:3000"
Vue.use(vueDebounce)

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
