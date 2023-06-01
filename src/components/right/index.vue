<template>
  <div class="container">
    <div class="list-tab">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="面渲染" name="1"></el-tab-pane>
        <el-tab-pane label="点渲染" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="list-table">
      <el-table
        :data="activeName === '1' ? tableData : tableData1"
        height="600"
        border
        :header-cell-style="{
          textAlign: 'center',
          fontWeight: 400,
          backgroundColor: '#f8f9fb'
        }"
        :cell-style="{ textAlign: 'center' }"
        @cell-dblclick="handleDb"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
      >
        <el-table-column prop="name" label="地区" width="150">
        </el-table-column>
        <el-table-column v-if="activeName === '1'" label="颜色">
          <template #default="scope">
            <el-color-picker
              v-model="scope.row.color"
              show-alpha
              @change="handleClick(scope.row)"
            ></el-color-picker>
          </template>
        </el-table-column>
        <el-table-column v-if="activeName === '2'" prop="ccnum" label="数值">
        </el-table-column>
        <el-table-column center fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-button
              v-if="activeName === '2'"
              @click="changeNum(scope.row)"
              type="text"
              size="small"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="down(scope.row)"
              >下钻</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="list-dialog">
      <el-dialog title="编辑数量" v-model="listVisible" width="30%" center>
        <el-input
          v-model="num.ccnum"
          type="number"
          autocomplete="off"
        ></el-input>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="listVisible = false">取 消</el-button>
            <el-button type="primary" @click="subSum">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Nums {
  ccnum?: string
}

const activeName = ref('1')
const tableData = ref<any[]>([]) //面渲染值
const tableData1 = ref([]) //点渲染值
const listVisible = ref(false)
const num = ref<Nums>({})
function tabClick() {
  console.log('first')
}
function handleDb() {
  console.log('first')
}
function cellMouseEnter() {
  console.log('first')
}
function cellMouseLeave() {
  console.log('first')
}
function handleClick(value: string) {
  console.log('first')
}
function changeNum(value: string) {
  console.log('first')
}
function down(value: string) {
  console.log('first')
}
function subSum() {
  console.log('first')
}
</script>

<style lang="scss" scoped>
.container {
  padding: 10px;

  height: 100vh;
  background: #fff;
  .list-table:hover,
  .server-table i.el-tooltip:hover {
    cursor: pointer; //鼠标变手
  }
  .list-tab {
    margin-top: 20px;
  }
}
</style>

<!-- <script>
export default {
  mounted() {
    this.$bus.$on('backAdcode', (a, b) => {
      // console.log(a, b);
      this.tableData = a
      this.tableData1 = b
    })
  },
  methods: {
    //点、面渲染切换
    tabClick(tab) {
      console.log(tab.name)
    },

    handleDb(row) {
      // console.log(row);
      if (row.level == 'province') {
        this.$bus.$emit('setFitBoundsLevel', row.adcode)
      } else if (row.province || (!row.flag && row.flag != 0)) {
        if (row.ccnum) {
          this.$bus.$emit('setFitBoundsProvince', row.city_code)
          return
        }
        this.$bus.$emit('setFitBoundsProvince', row.adcode)
      } else {
        if (row.ccnum) {
          this.$bus.$emit('setFitBoundsCity', row.city_code)
          return
        }
        this.$bus.$emit('setFitBoundsCity', row.adcode)
      }
    },

    cellMouseEnter(row) {
      // console.log("鼠标移入",row);
      if (row.adcode) {
        this.$bus.$emit('MouseEnter', row.adcode, row?.province, row?.level)
        return
      }
      if (row.city_code)
        this.$bus.$emit('MouseEnterPoint', row.city_code, row?.city, row?.name)
    },
    cellMouseLeave(row) {
      // console.log("鼠标移出",row);
      if (row.adcode) {
        this.$bus.$emit('MouseLeave', row.adcode)
        return
      }
      if (row.city_code) this.$bus.$emit('MouseLeavePoint', row.adcode)
    },

    //更改颜色
    handleClick(row) {
      // console.log(row);
      if (!row.color) {
        row.color = 'rgba(255, 255, 255, 0)'
      }
      this.$bus.$emit('changeSource', row?.province, row?.city, row?.town, row)
    },

    //更改数值
    changeNum(row) {
      // console.log(row);
      this.num = row
      this.listVisible = true
    },

    //下钻
    down(e) {
      // console.log(e);
      if (e.ccnum) {
        this.$bus.$emit('downMap', e.city_code)
        return
      }
      this.$bus.$emit('downMap', e.adcode)
    },

    //更改数值确认
    subSum() {
      // console.log(this.num);
      // console.log(typeof this.num.ccnum);
      // eslint-disable-next-line no-prototype-builtins
      if (this.num.hasOwnProperty('flag')) {
        //区级更改
        this.$bus.$emit('changeSource2', this.tableData1)
        this.listVisible = false
        return
      }
      //市级更改
      this.$bus.$emit('changeSource1', this.tableData1)
      this.listVisible = false
    }
  }
}
</script> -->
