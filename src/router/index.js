import Vue from "vue";
import Router from "vue-router";
import Posts from "../views/Posts.vue";
import PostDetail from "../views/PostDetail.vue";
import PageNotFound from "../views/PageNotFound.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    // {
    //   path: "/",
    //   name: "Posts",
    //   component: Posts
    // },
    {
      path: "/articles",
      name: "Posts",
      component: Posts
    },
    {
      path: "/search",
      name: "SearchPost",
      component: Posts
    },
    {
      path: "**",
      name: "PageNotFound",
      component: PageNotFound
    },
    {
      path: "/articles/:id",
      name: "PostDetail",
      component: PostDetail,
      props: true
    }
  ]
});
