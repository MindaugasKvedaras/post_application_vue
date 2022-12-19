<template>
  <div class="modal" :class="{ 'is-active': visibleError }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <img src="../assets/500error.png" alt="500-error"/>
      <h1 class="title has-text-danger">{{ error.message }}</h1>
    </div>
    <button class="modal-close is-large" aria-label="close" v-on:click="$emit('close-error')"></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visibleError: this.visible
    };
  },

  props: {
    error: {
      required: true,
      type: Object
    },

    visible: {
      require: true,
      type: Boolean,
      default: false
    }

  },

  watch: {
    visible: {
      immediate: true,
      handler: function(newVal) {
        this.visibleError = newVal;
      }
    }
  }
};
</script>

<style scoped>
  .modal-content{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
