import Vue from 'vue'
import Router from 'vue-router'
import Posts from '../views/Posts.vue'
import PostDetail from '../views/PostDetail.vue';
import PageNotFound from '../components/PageNotFound.vue';

Vue.use(Router)

export default new Router({
    routes: [
       {
        path: '/',
        name: 'Posts',
        component: Posts
       },
       {
        path: '/articles/:id',
        name: 'PostDetail',
        component: PostDetail,
        props: true
       },
       {
        path: '/:catchAll(.*)*',
        name: "PageNotFound",
        component: PageNotFound
       }
    ]
})