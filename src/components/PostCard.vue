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
        :errors="errors"
      ></post-delete-confirm>
      <div class="card">
        <div class="editor">
          <lead-pencil class="edit-icon" v-on:click="showEditModal" />
          <button class="delete" v-on:click="showDeleteModal"></button>
        </div>
        <router-link :to="{ name: 'PostDetail', params: { id: article.id, authorId: authorId } }">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title">{{ article.title }}</p>
            </div>
          </div>
          <div
            class="content"
            v-for="author in authors"
            :key="author.id"
            v-if="article.author == author.id"
          >
            <br />
            <p class="subtitle">Author: {{ author.name }}</p>
            <br />
            <p class="subtitle is-6">Created at: {{ article.createdAt }}</p>
            <p v-if="article.updatedAt">Updated at: {{ article.updatedAt }}</p>
          </div>
        </div>
      </router-link>
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
      title: this.article.title,
      authors: [],
      errors: [],
      authorId: undefined,
      id: this.article.id,
      showDeleteConfirm: false,
      showEditPost: false
    };
  },

  components: {
    LeadPencil,
    PostDeleteConfirm,
    PostEdit
  },

  props: {
    article: {
      required: true,
      type: Object
    },
  }, 

  //   visibleError: {
  //     type: Function,
  //     default: false
  //   }
  // },

  // watch: {
  //   visibleError: {
  //     immediate: false,
  //     handler: function(newVal) {
  //       this.visibleError = newVal;
  //     }
  //   },
  // },

  methods: {
    deletePost(id) {
      axios
        .delete(this.$apiUrl + "/articles/" + id)
        .then(() => this.reloadPosts())
        .catch(error => {
          error.message = "Oops server doesn't work!";
          if (error.request) {
            this.errors.push(error);
          }
        });
    },

    getAuthors() {
      axios
        .get(this.$apiUrl + "/authors", {
          name: this.name,
          authorId: this.id
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

    showErrorModal() {
      this.$emit("show-error");
    },

    reloadPosts() {
      this.$emit("reload-posts");
    }
  },

  created() {
    this.getAuthors();
  }
};
</script>

<style scoped>
.card {
  width: 100%;
  min-width: 350px;
  height: auto;
  min-height: 320px;
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
}
.label {
  margin-top: 10px;
}
</style>
