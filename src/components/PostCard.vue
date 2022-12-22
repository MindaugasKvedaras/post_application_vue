<template>
  <div>
    <post-edit
      :visible="showEditPost"
      :id="id"
      :postTitle="postTitle"
      :postBody="postBody"
      @close-edit-post-modal="closeEditModal"
      @postTitleChanged="postTitle = $event"
      @postBodyChanged="postBody = $event"
      @reload-posts="reloadPosts"
    ></post-edit>

    <post-delete-confirm
      :visible="showDeleteConfirm"
      :errors="errors"
      @close-delete-modal="closeDeleteModal"
      @delete-post="deletePost(article.id)"
    ></post-delete-confirm>

    <div class="card">
      <div class="editor">
        <lead-pencil
          class="edit-icon"
          @click="showEditModal"
          @reload-page="reloadPosts"
        />
        <div class="block">
          <span class="tag is-danger">
            Delete Post
            <button class="delete" @click="showDeleteModal"></button>
          </span>
        </div>
      </div>

      <router-link :to="{ name: 'PostDetail', params: { id: article.id } }">
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title">{{ article.title }}</p>
            </div>
          </div>
          <div
            class="content"
            v-for="postAuthor in authors"
            :key="postAuthor.id"
            v-if="article.author == postAuthor.id"
          >
            <br />
            <p class="subtitle">Author: {{ postAuthor.name }}</p>
            <br />
            <div class="date-info">
              <p class="tag">Created: {{ article.createdAt }}</p>
              <p class="tag" v-if="article.updatedAt">Updated: {{ article.updatedAt }}</p>
            </div>  
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
  components: {
    LeadPencil,
    PostDeleteConfirm,
    PostEdit
  },

  created() {
    this.getAuthors();
  },

  data() {
    return {
      postTitle: this.article.title,
      postBody: this.article.body,
      authors: [],
      errors: [],
      authorId: undefined,
      id: this.article.id,
      showDeleteConfirm: false,
      showEditPost: false
    };
  },

  props: {
    article: {
      required: true,
      type: Object
    }
  },

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

};
</script>

<style scoped>
.card {
  width: 100%;
  width: 350px;
  height: auto;
  height: 420px;
}

.editor {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}

.edit-icon {
  cursor: pointer;
  color: green;
}

.delete {
  color: red;
}

.card-content {
  display: flex;
  flex-direction: column;
  height: 300px;
}
.label {
  margin-top: 10px;
}

.title {
  text-align: center;
}

.content {
  margin-top: auto;
}
</style>
