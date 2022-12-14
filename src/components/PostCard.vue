<template>
  <div>
    <div class="card">
      <div class="editor">
        <lead-pencil class="edit-icon" />
        <button class="delete" v-on:click="deletePost(article.id)"></button>
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


export default {
  data() {
    return {
      authors: [],
    };
  },

  components: {
    LeadPencil,
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

    deletePost(id) {
      axios
        .delete(this.$apiUrl + "/articles/" + id)
        .then(() => this.$emit("reload-posts"));
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
