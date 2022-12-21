<template>
  <div class="error-container">
    <img src="../assets/crying.gif" />
    <div class="text-box">
      <h1 class="title">Aww...Don't Cry</h1>
      <p class="subtitle">It's just 404 error!</p>
      <p class="subtitle">What yuo're looking for may have been misplaced in long Term Memory.</p>
      <router-link :to="{name: 'Posts'}">
        <button class="button is-primary">Go HOME</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.error-container img {
  width: 30%;
}

.text-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 350px;
}

.text-box p {
  text-align: center;
}

</style>
