<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
*{
margin: 0;
padding: 0;
}
html,body,#app{
  height: 100%;
  width: 100%;
}
.nav {
  height: 40px;
  margin: 10px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
}
</style>
