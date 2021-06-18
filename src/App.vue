<template>
  <div id="app" style="flex-direction: column;padding-left: 1em;display: flex;flex-wrap: wrap;align-content: center;">
    <h1 class="title">Fast Buy / Sell Tool</h1>
    <Tool/>
  </div>
</template>

<script>
import Tool from './components/Tool.vue'
export default {
  name: 'App',
  components: {
    Tool
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
