<template>
  <div class="mainMiddle">
    <mapCom />
  </div>
</template>

<script setup lang="ts">
import mapCom from '../../components/map1/index.vue' // 地图
</script>

<style lang="scss" scoped>
.mainMiddle {
  width: 100%;
  height: 98%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .middle-data {
    margin: 20px 15px 0;
  }
  .plan-tab {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    img {
      width: 542px;
    }
  }
  .mapCom {
    width: 644px;
    height: 620px;
  }
  .middle-tab {
    margin-top: 40px;
  }
}
</style>
