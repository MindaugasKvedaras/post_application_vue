<template>
  <div class="modal" :class="{ 'is-active': showEditPost }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Edit post</p>
        <button
          class="delete"
          aria-label="close"
          v-on:click="cancelPostEdit()"
        ></button>
      </header>
      <section class="modal-card-body">

        <div v-if="isEdited" class="edited-container">
          <p class="title has-text-success">Successfully edited!</p>
          <img src="../assets/homer-simpson-woohoo.gif" />
        </div>

        <div class="nochange_error-container" v-if="isEmptyError">
          <p class="title has-text-danger" v-if="isEmptyError">{{ emptyerror.nochange }}</p>
          <img src="../assets/homer-thinks.png"/>
        </div>

        <form v-if="!isEdited" @submit.prevent="editPost(id)">
          <label class="label">Title</label>
          <input
            class="input is-success"
            type="text"
            :value="title"
            @input="changeTitle"
            @keyup.enter="editPost(id)"
            required
          />
          <label class="label">Article text</label>
          <textarea
            class="textarea is-primary"
            :value="body"
            @input="changeBody"
            type="text"
            @keyup.enter="editPost(id)"
            required
          />
        </form>
      </section>
      <footer class="modal-card-foot" v-if="!isEdited">
        <button
          type="submit"
          class="button is-success"
          v-on:click="editPost(id)"
        >
          Edit Post
        </button>

        <button class="button" v-on:click.prevent="cancelPostEdit()">
          Cancel
        </button>
        <p class="error" v-for="error of errors.slice(0, 1)">
          {{ error.message }}
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      newTitle: undefined,
      newBody: undefined,
      showEditPost: this.visible,
      updatedAt: undefined,
      isEdited: false,
      errors: [],
      emptyerror: [],
      isEmptyError: false,
      disabled: [true, true]
    };
  },

  props: {
    visible: {
      required: true,
      type: Boolean,
      default: false
    },

    id: {
      type: String
    },

    title: {
      required: String
    },

    body: {
      type: String
    },

    createdAt: {
      type: String
    }
  },

  watch: {
    visible: {
      immediate: true,
      handler: function(newVal) {
        this.showEditPost = newVal;
      }
    }
  },

  methods: {
    editPost(id) {
      if (!this.newTitle & !this.newBody) {
        this.emptyerror["nochange"] = "You did't change anything...";
        this.isEmptyError = true;
        console.log(this.emptyerror.nochange, this.isEmptyError);
      } else {
        this.emptyerror["nochange"] = "";
        console.log(this.emptyerror.nochange);
        this.isEmptyError = false;
        this.editPostById(id);
      }

      if (!this.errors.length && !this.emptyerror.nochange) {
        this.isEdited = true;
      } else {
        this.isEdited = false;
      }

      this.disabled = [this.disabled[1], true];
    },

    editPostById(id) {
      axios
        .patch(this.$apiUrl + "/articles/" + id, {
          title: this.newTitle,
          body: this.newBody,
          createdAt: this.createdAt,
          updatedAt: new Date().toLocaleString("lt-LT")
        })
        .then(response => console.log(response))
        .then(() => this.$emit("reload-posts"))
        .catch(
          error => (
            (error.message = "Article was not created! Problems with server!"),
            this.errors.push(error)
          )
        );
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

    cancelPostEdit() {
      this.$emit("close-edit-post-modal");
      this.newTitle = undefined;
      this.newBody = undefined;
      this.isEdited = false;
      this.isEmptyError = false;
    },

    changeTitle(event) {
      this.newTitle = event.target.value;
      this.$emit("titleChanged", this.newTitle);
    },

    changeBody(event) {
      this.newBody = event.target.value;
      this.$emit("bodyChanged", this.newBody);
    }
  },

  created() {
    console.log(this.errors.length);
  }
};
</script>

<style scoped>

.edited-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nochange_error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nochange_error-container img {
  width: 40%;
}
</style>
