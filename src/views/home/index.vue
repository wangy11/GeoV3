<template>
  <div class="largeHome">
    <div class="largeHome_main">
      <div class="main-middle">
        <main-middle class="mainMiddle" />
      </div>
      <div class="main-right">
        <main-right />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import mainMiddle from './mainMiddle.vue' // 中部
import mainRight from '@/components/right/index.vue' // 中部
</script>

<style lang="scss" scoped>
.largeHome {
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  // background: url(../../assets/img/znj/bg.png) no-repeat;
  // background-size: 100% 100%;
  .largeHome_main {
    height: 100vh;
    display: flex;
    // justify-content: center;
    align-items: center;
    .main-middle {
      width: 70vw;
      // width: 880px;

      background: url(../../assets/img/bg.png) no-repeat;
      background-size: 100% 100%;
    }
    .main-right {
      width: 30vw;
    }
  }
}
</style>
