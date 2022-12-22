<template>
  <div class="modal" :class="{ 'is-active': showError }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <img src="../assets/500error.png" alt="500-error"/>
      <h1 class="title has-text-danger">{{ error.message }}</h1>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="$emit('close-error')"></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showError: this.visible
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
        this.showError = newVal;
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

  .title {
    text-align: center;
  }
</style>
