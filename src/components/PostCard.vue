<template>
  <div>
    <post-edit
      :visible="showEditPost"
      v-on:close-edit-post-modal="closeEditModal"
      :id="id"
      v-on:reload-posts="reloadPosts"
    ></post-edit>
    <post-delete-confirm
      :visible="showDeleteConfirm"
      v-on:close-delete-modal="closeDeleteModal"
      v-on:delete-post="deletePost(article.id)"
    ></post-delete-confirm>
    <div class="card">
      <div class="editor">
        <lead-pencil class="edit-icon" v-on:click="showEditModal"/>
        <button class="delete" v-on:click="showDeleteModal"></button>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title">{{ article.title }}</p>
          </div>
        </div>
        <div class="content">
          {{ article.body }}
        </div>
        <div
          class="content"
          v-for="author in authors"
          :key="author.id"
          v-if="article.author == author.id"
        >
          <br />
          <p>Created at: {{ article.createdAt }} by {{ author.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

import LeadPencil from "vue-material-design-icons/Pencil.vue";

import PostDeleteConfirm from "./PostDeleteConfirm.vue";

import PostEdit from "./PostEdit.vue";

export default {
  data() {
    return {
      title: undefined,
      body: undefined,
      authors: [],
      id: this.article.id,
      showDeleteConfirm: false,
      showEditPost: false,
    };
  },

  components: {
    LeadPencil,
    PostDeleteConfirm,
    PostEdit,
  },

  props: {
    article: {
      required: true,
      type: Object
    },
  },
  methods: {
    // postInAuthors(id) {
    //   axios.patch(this.$apiUrl + "/authors/" + id, {
    //     createdAt: new Date().toLocaleString("lt-LT")
    //   });
    // },

    editPost(id) {
      axios
        .patch(this.$apiUrl + "/articles/" + id, {
          title: this.title,
          body: this.body,
          updateddAt: new Date().toLocaleString("lt-LT")
        })
        .then(response => console.log(response))
        .then(() => this.reloadPosts())
        // .catch(
        //   error => (
        //     (error.message = "Article was not created! Problems with server!"),
        //     this.errors.push(error)
        //   )
        // );

      if (!this.errors.length) {
        this.resetFields();
      }

        this.disabled = [this.disabled[1], true];
    },


    deletePost(id) {
      axios
        .delete(this.$apiUrl + "/articles/" + id)
        .then(() => this.reloadPosts());
    },

    getAuthors() {
      axios
        .get(this.$apiUrl + "/authors", {
          name: this.name,
          id: this.id
        })
        .then(response => (this.authors = response.data))
        .then(response => console.log(response));
    },

    showDeleteModal() {
      this.showDeleteConfirm = true;
    },

    closeDeleteModal() {
      this.showDeleteConfirm = false;
    },

    showEditModal() {
      this.showEditPost = true;
    },

    closeEditModal() {
      this.showEditPost = false;
    },

    reloadPosts() {
      this.$emit('reload-posts');
    }

  },

  created() {
    this.getAuthors()
  }

};
</script>

<style scoped>
.card {
  width: 100%;
  max-width: 250px;
  height: 360px;
}

.editor {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.edit-icon {
  cursor: pointer;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* height: 100%; */
}
.label {
  margin-top: 10px;
}


</style>
