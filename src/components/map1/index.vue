<template>
  <div class="largeScreenMap">
    <div class="btn">
      <img src="@/assets/img/ico_title.png" alt="" class="img" />
      <span
        style="display: inline-block"
        v-for="(item, index) in history"
        :key="index"
        @click="changeXzqh_name(item.layerid, item.fname, index)"
      >
        <span v-if="index != 0">/ </span>{{ item.fname }}
      </span>
    </div>
    <div class="top-map">
      <div id="map" style="height: 100%" v-if="show"></div>
    </div>
  </div>
</template>
<script>
import * as turf from '@turf/turf'
import mapboxgl from 'mapbox-gl'
import * as earcut from './earcut'
import { addCountyLayer } from './utils'
import { getCity } from '@/services/index'
export default {
  name: 'Map',
  data() {
    return {
      history: [{ layerid: 'china', fname: '全国', adcode: '10000' }],
      adcode: '330000',
      show: true,
      map: null,
      fname: null,
      popup: null,
      bbox: [73.5013, 3.4065, 135.0961, 53.5632],
      curr_feature: { layerid: 'china', adcode: '10000', fname: '全国' } //当前显示的行政区划要素
    }
  },

  // mounted() {
  //   this.initmap();
  //   this.setFitBounds(this.bbox);

  //   //定位
  //   this.$bus.$on("setFitBoundsLevel", (adcode) => {
  //     this.dbSetFit("province", adcode);
  //   });
  //   this.$bus.$on("setFitBoundsProvince", (adcode) => {
  //     this.dbSetFit("city", adcode);
  //   });
  //   this.$bus.$on("setFitBoundsCity", (adcode) => {
  //     this.dbSetFit("county", adcode);
  //   });
  //   //更改颜色
  //   this.$bus.$on("changeSource", (province, city, town, row) => {
  //     // console.log("更改颜色row", row, town);
  //     if (town)
  //       this.map
  //         .getSource("new_town")
  //         .setData(this.map.getSource("new_town")._data);

  //     if (typeof province === "undefined" && !city) {
  //       this.map
  //         .getSource("province")
  //         .setData(this.map.getSource("province")._data);
  //       return;
  //     }
  //     if (province == "浙江省") {
  //       this.map.getSource("city").setData(this.map.getSource("city")._data);
  //     }
  //     if (city) {
  //       this.map
  //         .getSource("county")
  //         .setData(this.map.getSource("county")._data);
  //     }
  //     // console.log(this.map.getSource("new_town")._data.features);
  //   });
  //   //更改边界
  //   this.$bus.$on("MouseEnterPoint", (adcode, city, name) => {
  //     console.log(adcode, city, name);
  //     let obj = {
  //       type: "FeatureCollection",
  //     };
  //     if (city == name) {
  //       obj.features = [
  //         this.map
  //           .getSource("city_bounds")
  //           ._data.features.filter(
  //             (item) => item.properties.adcode == adcode
  //           )[0],
  //       ];
  //     } else {
  //       obj.features = [
  //         this.map
  //           .getSource("county_bounds")
  //           ._data.features.filter(
  //             (item) => item.properties.adcode == adcode
  //           )[0],
  //       ];
  //     }
  //     this.map.getSource("new_bounds").setData(obj);
  //   });
  //   this.$bus.$on("MouseLeavePoint", () => {
  //     this.map
  //       .getSource("new_bounds")
  //       .setData({ type: "FeatureCollection", features: [] });
  //   });

  //   this.$bus.$on("MouseEnter", (adcode, province, level) => {
  //     // console.log(adcode, province, level);
  //     let obj = {
  //       type: "FeatureCollection",
  //     };
  //     if (level == "province") {
  //       obj.features = [
  //         this.map
  //           .getSource("province")
  //           ._data.features.filter(
  //             (item) => item.properties.adcode == adcode
  //           )[0],
  //       ];
  //       this.map.getSource("new_bounds").setData(obj);
  //       return;
  //     }
  //     if (level == "city") {
  //       obj.features = [
  //         this.map
  //           .getSource("city_bounds")
  //           ._data.features.filter(
  //             (item) => item.properties.adcode == adcode
  //           )[0],
  //       ];
  //     } else {
  //       obj.features = [
  //         this.map
  //           .getSource("county_bounds")
  //           ._data.features.filter(
  //             (item) => item.properties.adcode == adcode
  //           )[0],
  //       ];
  //     }
  //     this.map.getSource("new_bounds").setData(obj);
  //   });

  //   this.$bus.$on("MouseLeave", () => {
  //     this.map
  //       .getSource("new_bounds")
  //       .setData({ type: "FeatureCollection", features: [] });
  //     // this.map.setLayoutProperty("new_bounds", "visibility", "visible");
  //   });
  //   //更改市级数值
  //   this.$bus.$on("changeSource1", () => {
  //     this.map
  //       .getSource("popup_left")
  //       .setData(this.map.getSource("popup_left")._data);
  //   });
  //   //更改区级数值
  //   this.$bus.$on("changeSource2", () => {
  //     this.map
  //       .getSource("county_center_left")
  //       .setData(this.map.getSource("county_center_left")._data);
  //   });
  //   //下钻
  //   this.$bus.$on("downMap", (adcode) => {
  //     this.changeXzqh_adcode(adcode);
  //   });
  // },
  methods: {
    initmap() {
      mapboxgl.accessToken =
        'pk.eyJ1Ijoic3o2NjY2NjYiLCJhIjoiY2tuam44NXZzMDEwMzJ1cGV3djR6OHA5cCJ9.2LA3YOPHRLTTB25CvAoIdw'
      const teestyle = require('./tee.json')
      this.map = new mapboxgl.Map({
        container: 'map',
        style: teestyle,
        zoom: 3.5,

        center: [120.21278, 29.16],
        localIdeographFontFamily: "'黑体','san-serif'"
      })

      window.map = this.map
      this.popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })

      //移入高亮

      // this.map.on("mouseleave", "province_center", (e) => {
      //   this.highLight([]);
      //   popup.remove()
      // });
      // this.map.on("mouseenter", "province_center", (e) => {
      //   console.log(e.features[0].properties.center.slice(1,-1).split(','));
      // });

      this.map.on('mousemove', 'province', (e) => {
        this.querySourceFeatures(e)
      })
      this.map.on('mouseleave', 'province', () => {
        this.highLight([])
        this.popup.remove()
      })

      this.map.on('mouseleave', 'newCity', (e) => {
        this.highLight([])
        this.popup.remove()
      })
      this.map.on('mousemove', 'newCity', (e) => {
        this.querySourceFeatures(e)
      })

      this.map.on('mousemove', 'city', (e) => {
        this.querySourceFeatures(e)
      })
      this.map.on('mouseleave', 'city', (e) => {
        this.highLight([])
        this.popup.remove()
      })
      this.map.on('mousemove', 'county', (e) => {
        this.querySourceFeatures(e)
      })
      this.map.on('mouseleave', 'county', (e) => {
        this.highLight([])
        this.popup.remove()
      })

      //监听尺寸变化 改变地图缩放等级
      window.addEventListener('resize', () => {
        this.setFitBounds(this.bbox)
      }),
        //禁止鼠标缩放
        // this.map.scrollZoom.disable();
        //禁用双击缩放
        // this.map.doubleClickZoom.disable();
        //禁用拖动平移
        // this.map.dragPan.disable();
        //禁用拖动旋转
        // this.map.dragRotate.disable();

        this.map.on('load', () => {
          //添加初始随机色
          this.map.getSource('city')._data.features.forEach((item) => {
            let colorStr = this.randomColor()
            item.properties.color = '#' + colorStr
            item.properties.level = 'city'
            this.map.getSource('city_center')._data.features.forEach((val) => {
              if (item.properties.name == val.properties.name) {
                item.properties.center = val.geometry.coordinates
              }
            })
          })
          this.map.getSource('city').setData(this.map.getSource('city')._data)
          //添加初始随机色
          this.map.getSource('county')._data.features.forEach((item) => {
            let colorStr = this.randomColor()
            item.properties.color = '#' + colorStr
            item.properties.level = 'county'
            this.map
              .getSource('county_center')
              ._data.features.forEach((val) => {
                if (item.properties.name == val.properties.name) {
                  item.properties.center = val.geometry.coordinates
                }
              })
          })
          this.map
            .getSource('county')
            .setData(this.map.getSource('county')._data)
          //添加初始随机数值
          this.map
            .getSource('county_center_left')
            ._data.features.forEach((item) => {
              const num = Math.round(Math.random() * 1000)
              item.properties.ccnum = num
            })
          this.map
            .getSource('county_center_left')
            .setData(this.map.getSource('county_center_left')._data)

          let arr = []
          this.map.getSource('province')._data.features.forEach((item) => {
            arr.push(item.properties)
          })
          this.addAdcode()
          // this.$bus.$emit('backAdcode', arr)
        })

      this.map.on('style.load', () => {
        // console.log(this.map.getSource("province")._data.features);
        this.map.getSource('province')._data.features.forEach((item) => {
          item.properties.color = '#396cf6'
        })
        this.map
          .getSource('province')
          .setData(this.map.getSource('province')._data)
        this.map.loadImage('./mapbox/jidi.png', (error, image) => {
          if (error) throw error
          this.map.addImage('jidi', image)
        })
        this.map.loadImage('./mapbox/xiangmu.png', (error, image) => {
          if (error) throw error
          this.map.addImage('xiangmu', image)
        })
        this.map.setLayoutProperty('popup_left', 'icon-image', 'xiangmu')
        this.map.setLayoutProperty('popup_right', 'icon-image', 'jidi')
        this.map.setLayoutProperty(
          'county_center_left',
          'icon-image',
          'xiangmu'
        )
        this.map.setLayoutProperty('county_center_right', 'icon-image', 'jidi')
        this.show = true
        this.map.setLayoutProperty('popup_left', 'visibility', 'none')
        this.map.setLayoutProperty('popup_right', 'visibility', 'none')
        this.map.on('click', 'province', this.handleXzqh)
        this.map.on('click', 'city', this.handleXzqh)
        this.map.on('click', 'county', this.handleXzqh)
      })
    },

    //随机色生成
    randomColor() {
      let colorStr = ''
      //字符串的每一字符的范围
      const randomArr = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f'
      ]
      //产生一个六位的字符串
      for (var i = 0; i < 6; i++) {
        //15是范围上限，0是范围下限，两个函数保证产生出来的随机数是整数
        colorStr += randomArr[Math.ceil(Math.random() * (15 - 0) + 0)]
      }
      return colorStr
    },

    //定位
    dbSetFit(layerid, adcode) {
      const features = this.map
        .getSource(layerid)
        ._data.features.filter((item) => item.properties.adcode == adcode)
      this.bbox = turf.bbox(features[0].geometry)
      this.setFitBounds(this.bbox)
    },

    //county添加属性
    addAdcode() {
      this.map.getSource('county')._data.features.map((item) => {
        this.map.getSource('county_center_left')._data.features.map((data) => {
          if (item.properties.name == data.properties.name)
            data.properties.city_code = item.properties.adcode
        })
      })
    },

    //高亮
    querySourceFeatures(e) {
      const features = this.map
        .getSource(e.features[0].layer.id)
        ._data.features.filter(
          (item) => item.properties.adcode == e.features[0].properties.adcode
        )
      const lngLat = e.features[0].properties.center.slice(1, -1).split(',')
      this.popup
        .setLngLat(lngLat)
        .setOffset([0, -30])
        .setHTML(
          `<span>adcode: </span><span style="color:#2744ff">${e.features[0].properties.adcode}</span><br/>
            <span>name: </span><span style="color:#2744ff">${e.features[0].properties.name}</span><br/>
            <span>level: </span><span style="color:#2744ff">${e.features[0].properties.level}</span>`
        )
        .addTo(this.map)
      this.highLight(features[0])
    },

    //高亮显示某要素图形
    highLight(features) {
      let obj = {}
      obj.features = [features]
      obj.type = 'FeatureCollection'
      this.map.getSource('temp').setData(obj)
    },

    async addCity(layerid, geometry, fname, adcode) {
      // console.log(adcode);
      const res = await getCity(adcode)
      this.map.getSource('newCity').setData(res.data.data)
      this.map.getSource('newCity_bounds').setData(res.data.data)
      this.map.setLayoutProperty('newCity', 'visibility', 'visible')
      this.map.setLayoutProperty('newCity_bounds', 'visibility', 'visible')
      this.map.setLayoutProperty('province', 'visibility', 'none')
      this.map.setLayoutProperty('province_bounds', 'visibility', 'none')
      this.map.setLayoutProperty('province_center', 'visibility', 'none')
      this.history.push({ layerid, fname })
      this.bbox = turf.bbox(geometry)
      this.setFitBounds(this.bbox)
      let obj = {
        type: 'FeatureCollection',
        features: []
      }
      // console.log(res.data.data.features);
      res.data.data.features.map((item) => {
        obj.features.push({
          type: 'Feature',
          properties: {
            adcode: item.properties.adcode,
            name: item.properties.name
          },
          geometry: {
            type: 'Point',
            coordinates: item.properties.centroid
              ? item.properties.centroid
              : item.properties.center
          }
        })
      })
      // console.log(obj);
      this.map.getSource('new_city_center').setData(obj)
      // this.$bus.$emit('backAdcode', [])
    },
    //行政区划切换
    handleXzqh(e) {
      // console.log(e.features[0]);
      var feature = e.features[0]
      var fname = feature.properties.name
      this.changeXzqh(feature.layer.id, feature, e.lngLat)
    },

    //前端调用 根据layerid 和名称，设置当前行政区
    changeXzqh_name(layerid, fname, index) {
      // console.log(layerid, fname, index);
      this.history.splice(index + 1)
      if (layerid == 'china') {
        if (this.map.getLayer('county-test')) {
          this.map.removeLayer('county-test')
        }
        this.curr_feature = {
          layerid: 'china',
          adcode: '10000',
          fname: '全国'
        }
        this.map
          .getSource('new_city_center')
          .setData({ type: 'FeatureCollection', features: [] })
        this.map.setLayoutProperty('newCity', 'visibility', 'none')
        this.map.setLayoutProperty('newCity_bounds', 'visibility', 'none')

        this.map.setLayoutProperty('province', 'visibility', 'visible')
        this.map.setLayoutProperty('province_bounds', 'visibility', 'visible')
        this.map.setLayoutProperty('province_center', 'visibility', 'visible')
        this.map.setLayoutProperty('city', 'visibility', 'none')
        this.map.setLayoutProperty('city_bounds', 'visibility', 'none')
        this.map.setLayoutProperty('city_center', 'visibility', 'none')
        this.map.setLayoutProperty('county', 'visibility', 'none')
        this.map.setLayoutProperty('popup_left', 'visibility', 'none')
        this.map.setLayoutProperty('county_bounds', 'visibility', 'none')
        this.map.setLayoutProperty('county_center', 'visibility', 'none')
        this.map.setLayoutProperty('county_center_left', 'visibility', 'none')
        this.map.setLayoutProperty('county_center_right', 'visibility', 'none')

        this.map.setLayoutProperty('town', 'visibility', 'none')
        this.map.setLayoutProperty('new_town', 'visibility', 'none')
        this.map.setLayoutProperty('town_bounds', 'visibility', 'none')
        this.map.setLayoutProperty('town_center', 'visibility', 'none')
        this.map.setLayoutProperty('poi', 'visibility', 'none')

        this.map.setLayoutProperty('tiandistatellite84', 'visibility', 'none')
        this.map.setLayoutProperty(
          'tiandistatellitelabel84',
          'visibility',
          'none'
        )
        this.bbox = [73.5013, 3.4065, 135.0961, 53.5632]
        this.setFitBounds(this.bbox)
        let arr = []
        this.map.getSource('province')._data.features.forEach((item) => {
          arr.push(item.properties)
        })
        // this.$bus.$emit('backAdcode', arr)
      }
      if (layerid == 'province') {
        if (fname !== '浙江省') return
        if (this.map.getLayer('county-test')) {
          this.map.removeLayer('county-test')
        }
        this.curr_feature = {
          layerid: 'city',
          adcode: '330000',
          fname: '浙江省'
        }

        this.map.setLayoutProperty('popup_left', 'visibility', 'visible')
        this.map.setLayoutProperty('popup_right', 'visibility', 'none')
        //关闭缩放 拖动
        // this.map.dragPan.disable();
        // this.map.scrollZoom.disable();

        this.map.setLayoutProperty('city', 'visibility', 'visible')
        this.map.setLayoutProperty('city_bounds', 'visibility', 'visible')
        this.map.setLayoutProperty('city_center', 'visibility', 'visible')

        // this.map.setFilter("county", ["==", ["get", "city"], fname]);
        // this.map.setFilter("county_bounds", ["==", ["get", "city"], fname]);
        // this.map.setFilter("county_center", ["==", ["get", "city"], fname]);

        this.map.setLayoutProperty('county', 'visibility', 'none')
        this.map.setLayoutProperty('county_bounds', 'visibility', 'none')
        this.map.setLayoutProperty('county_center', 'visibility', 'none')
        this.map.setLayoutProperty('county_center_left', 'visibility', 'none')
        this.map.setLayoutProperty('county_center_right', 'visibility', 'none')

        this.map.setLayoutProperty('new_town', 'visibility', 'none')
        this.map.setLayoutProperty('town', 'visibility', 'none')
        this.map.setLayoutProperty('town_bounds', 'visibility', 'none')
        this.map.setLayoutProperty('town_center', 'visibility', 'none')
        this.map.setLayoutProperty('poi', 'visibility', 'none')

        this.map.setLayoutProperty('tiandistatellite84', 'visibility', 'none')
        this.map.setLayoutProperty(
          'tiandistatellitelabel84',
          'visibility',
          'none'
        )
        this.bbox = [118.011, 27.131, 122.76, 31.171]
        this.setFitBounds(this.bbox)
        // console.log(this.curr_feature);
        let arr = []
        let arr1 = []
        this.map.getSource('city')._data.features.forEach((item) => {
          arr.push(item.properties)
        })
        this.map.getSource('popup_left')._data.features.forEach((item) => {
          arr1.push(item.properties)
        })
        // this.$bus.$emit('backAdcode', arr, arr1)
      } else if (['city', 'county', 'town'].indexOf(layerid) > -1) {
        this.history.splice(index)
        var myFeatures = this.map.getSource(layerid)._data
        // console.log(myFeatures, fname, layerid);
        if (myFeatures) {
          myFeatures = myFeatures.features.filter(
            (feature) => feature.properties.name == fname
          )
          // console.log(myFeatures);

          if (myFeatures.length > 0) {
            this.changeXzqh(layerid, myFeatures[0], null)
          }
        }
      }
    },

    //前端调用 根据adcode，设置当前行政区
    changeXzqh_adcode(adcode) {
      if (adcode.toString().slice(2) == '0000' && adcode != '330000') {
        let geometry = []
        let fname = ''
        this.map.getSource('province')._data.features.forEach((item) => {
          if (item.properties.adcode == adcode) {
            geometry = item.geometry
            fname = item.properties.name
          }
        })
        this.addCity('province', geometry, fname, adcode)
      }
      if (adcode == '330000') {
        if (this.map.getLayer('county-test')) {
          this.map.removeLayer('county-test')
        }
        this.history.push({
          layerid: 'province',
          adcode: '330000',
          fname: '浙江省'
        })
        let arr = []
        let arr1 = []
        this.map.getSource('city')._data.features.forEach((item) => {
          arr.push(item.properties)
        })
        this.map.getSource('popup_left')._data.features.forEach((item) => {
          arr1.push(item.properties)
        })
        arr1.forEach((item) => {
          item.name = item.city
        })
        // console.log(arr, ">>>>>>>>>");
        // this.$bus.$emit('backAdcode', arr, arr1)
        //map.setPaintProperty('city', 'fill-color', '#faafee');
        this.map.setLayoutProperty('city', 'visibility', 'visible')
        this.map.setLayoutProperty('city_bounds', 'visibility', 'visible')
        this.map.setLayoutProperty('city_center', 'visibility', 'visible')
        this.map.setLayoutProperty('popup_left', 'visibility', 'visible')
        // this.map.setLayoutProperty("popup_right", "visibility", "visible");
        this.map.setLayoutProperty('province', 'visibility', 'none')
        this.map.setLayoutProperty('province_bounds', 'visibility', 'none')
        this.map.setLayoutProperty('province_center', 'visibility', 'none')
        this.bbox = [118.011, 27.131, 122.76, 31.171]
        this.setFitBounds(this.bbox)
      } else if (adcode.length == 6 && adcode.indexOf('33') == 0) {
        var layerid = 'county'
        if (adcode.endsWith('00')) {
          layerid = 'city'
        }

        var myFeatures = this.map.getSource(layerid)._data

        if (myFeatures) {
          myFeatures = myFeatures.features.filter(
            (feature) => feature.properties.adcode == adcode
          )
          if (myFeatures.length > 0) {
            this.changeXzqh(layerid, myFeatures[0], null)
          }
        }
      } else if (adcode.length == 9 && adcode.indexOf('33') == 0) {
        let layerid = 'town'
        let myFeatures = this.map.getSource(layerid)._data
        if (myFeatures) {
          myFeatures = myFeatures.features.filter(
            (feature) => feature.properties.adcode == adcode
          )
          if (myFeatures.length > 0) {
            this.changeXzqh(layerid, myFeatures[0], null)
          }
        }
      }
    },

    changeXzqh(layerid, feature, lngLat) {
      let geometry = feature.geometry
      let fname = feature.properties.name
      let adcode = feature.properties.adcode

      if (layerid == 'province' && fname !== '浙江省')
        this.addCity(layerid, geometry, fname, adcode)
      this.curr_feature = { layerid, geometry, fname, adcode, lngLat }
      this.$emit('changeXzqh', this.curr_feature)
      if (layerid == 'province' && fname == '浙江省') {
        this.history.push({ layerid, fname })
        this.curr_feature.layerid = 'province'
        let arr = []
        let arr1 = []
        this.map.getSource('city')._data.features.forEach((item) => {
          arr.push(item.properties)
        })
        this.map.getSource('popup_left')._data.features.forEach((item) => {
          arr1.push(item.properties)
        })
        arr1.forEach((item) => {
          item.name = item.city
        })
        // console.log(arr, ">>>>>>>>>");
        // this.$bus.$emit('backAdcode', arr, arr1)
        //map.setPaintProperty('city', 'fill-color', '#faafee');
        this.map.setLayoutProperty('city', 'visibility', 'visible')
        this.map.setLayoutProperty('city_bounds', 'visibility', 'visible')
        this.map.setLayoutProperty('city_center', 'visibility', 'visible')
        this.map.setLayoutProperty('popup_left', 'visibility', 'visible')
        // this.map.setLayoutProperty("popup_right", "visibility", "visible");
        this.map.setLayoutProperty('province', 'visibility', 'none')
        this.map.setLayoutProperty('province_bounds', 'visibility', 'none')
        this.map.setLayoutProperty('province_center', 'visibility', 'none')

        //生成Boundingbox
        // bbox = [118.011, 27.131, 122.76, 31.171];
        this.bbox = [118.011, 27.131, 122.76, 31.171]
      } else if (layerid == 'city') {
        this.history.push({ layerid, fname })
        if (this.map.getLayer('county-test')) {
          this.map.removeLayer('county-test')
        }
        let arr = []
        let arr1 = []
        this.map
          .getSource('county')
          ._data.features.filter((item) => {
            return item.properties.city == fname
          })
          .forEach((val) => {
            arr.push(val.properties)
          })
        this.map
          .getSource('county_center_left')
          ._data.features.filter((item) => {
            return item.properties.city == fname
          })
          .forEach((val) => {
            arr1.push(val.properties)
          })
        // this.$bus.$emit('backAdcode', arr, arr1)
        this.map.setLayoutProperty('popup_left', 'visibility', 'none')

        this.map.setFilter('county', ['==', ['get', 'city'], fname])
        this.map.setFilter('county_bounds', ['==', ['get', 'city'], fname])
        this.map.setFilter('county_center', ['==', ['get', 'city'], fname])
        this.map.setFilter('county_center_left', ['==', ['get', 'city'], fname])
        this.map.setFilter('county_center_right', [
          '==',
          ['get', 'city'],
          fname
        ])
        this.map.setLayoutProperty('popup_left', 'visibility', 'none')
        this.map.setLayoutProperty('popup_right', 'visibility', 'none')
        this.map.setLayoutProperty('county', 'visibility', 'visible')
        this.map.setLayoutProperty('county_bounds', 'visibility', 'visible')
        this.map.setLayoutProperty('county_center', 'visibility', 'visible')
        this.map.setLayoutProperty(
          'county_center_left',
          'visibility',
          'visible'
        )
        this.map.setLayoutProperty('county_center_right', 'visibility', 'none')
        this.map.setLayoutProperty('city', 'visibility', 'none')
        this.map.setLayoutProperty('city_bounds', 'visibility', 'none')
        this.map.setLayoutProperty('city_center', 'visibility', 'none')
        this.map.setLayoutProperty('town', 'visibility', 'none')
        this.map.setLayoutProperty('new_town', 'visibility', 'none')
        this.map.setLayoutProperty('town_bounds', 'visibility', 'none')
        this.map.setLayoutProperty('town_center', 'visibility', 'none')
        this.map.setLayoutProperty('tiandistatellite84', 'visibility', 'none')
        this.map.setLayoutProperty(
          'tiandistatellitelabel84',
          'visibility',
          'none'
        )

        //生成Boundingbox
        this.bbox = turf.bbox(geometry)
        //关闭缩放 拖动
        // this.map.dragPan.disable();
        // this.map.scrollZoom.disable();
      } else if (layerid == 'county') {
        this.history.push({ layerid, fname })
        this.addCounty(this.curr_feature.fname)
        this.map.setFilter('town', ['==', ['get', 'county'], fname])
        this.map.setFilter('town_bounds', ['==', ['get', 'county'], fname])
        this.map.setFilter('town_center', ['==', ['get', 'county'], fname])
        this.map.setLayoutProperty('town', 'visibility', 'visible')
        this.map.setLayoutProperty('new_town', 'visibility', 'visible')
        this.map.setLayoutProperty('town_bounds', 'visibility', 'visible')
        this.map.setLayoutProperty('town_center', 'visibility', 'visible')
        this.map.setLayoutProperty('county', 'visibility', 'none')
        this.map.setLayoutProperty('county_bounds', 'visibility', 'none')
        this.map.setLayoutProperty('county_center', 'visibility', 'none')
        this.map.setLayoutProperty('county_center_left', 'visibility', 'none')
        this.map.setLayoutProperty('county_center_right', 'visibility', 'none')
        this.map.setLayoutProperty('poi', 'visibility', 'none')

        this.map.setLayoutProperty(
          'tiandistatellite84',
          'visibility',
          'visible'
        )
        this.map.setLayoutProperty(
          'tiandistatellitelabel84',
          'visibility',
          'visible'
        )

        //生成Boundingbox
        this.bbox = turf.bbox(geometry)
        setTimeout(() => {
          let arr = []
          let value = []
          this.map
            .queryRenderedFeatures(
              [
                [0, 0],
                [1024, 768]
              ],
              { layers: ['town_bounds'] }
            )
            .forEach((val) => {
              val.properties.color = 'rgba(255, 255, 255, 0)'
              val.properties.name = val.properties.town
              value.push(val)
            })
          this.map
            .getSource('new_town')
            .setData({ type: 'FeatureCollection', features: value })
          // console.log(this.map.getSource("new_town")._data.features);
          this.map
            .getSource('new_town')
            ._data.features.forEach((item) => arr.push(item.properties))
          // this.$bus.$emit('backAdcode', arr)
        }, 500)
      } else if (layerid == 'town') {
        this.history.push({ layerid, fname })
        // console.log(this.map.getSource("town_bounds")._data.features);
        this.map.setLayoutProperty('town', 'visibility', 'visible')
        this.map.setLayoutProperty('town_bounds', 'visibility', 'visible')
        this.map.setLayoutProperty('town_center', 'visibility', 'visible')
        this.map.setLayoutProperty('poi', 'visibility', 'none')

        this.map.setLayoutProperty(
          'tiandistatellite84',
          'visibility',
          'visible'
        )
        this.map.setLayoutProperty(
          'tiandistatellitelabel84',
          'visibility',
          'visible'
        )
      }

      if (this.bbox) {
        this.setFitBounds(this.bbox)
      }
    },

    setFitBounds(bbox) {
      // console.log(this.map.getZoom());
      /* 中心点偏移 */
      let offset = [0, 0, 0, 0]

      this.map.fitBounds(
        [
          [bbox[0] + offset[0], bbox[1]],
          [bbox[2] + offset[2], bbox[3]]
        ],
        {
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
        }
      )
    },

    async addCounty(name) {
      if (this.map.getLayer('county-test')) {
        this.map.removeLayer('county-test')
      }
      var results = null
      this.map.getSource('county_bounds')._data.features.forEach((item) => {
        if (item.properties.name == name) {
          results = item
        }
      })
      // console.log('results:',results);
      // var query = await fetch(
      //   "https://sccy.zjxc.gov.cn/apiInterface/interface/" +
      //     `hydra-code-egis/api/v1/geoserver/get-json-data?filter=name='${name}'&group=cite&id=t_zhejiang_county&maxFeatures=1`,
      //   { method: "GET" }
      // );

      // var results = await query.json();

      var bbox = eval(results.properties.extent)
      this.map.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]]
        ],
        180,
        0,
        true
      )

      var coordinates = [
        [
          [-180, 86],
          [-180, -86],
          [180, -86],
          [180, 86]
        ]
      ]
      for (let i = 0; i < results.geometry.coordinates.length; i++) {
        coordinates.push(results.geometry.coordinates[i][0])
      }

      var data = earcut.flatten(coordinates)
      var list = []

      for (var i = 0; i < data.vertices.length / 2; i++) {
        var lnglat = mapboxgl.MercatorCoordinate.fromLngLat({
          lng: data.vertices[i * 2],
          lat: data.vertices[i * 2 + 1]
        })
        list.push(lnglat)
      }
      var triangles = earcut(data.vertices, data.holes, data.dimensions)

      // var deviation = earcut.deviation(vertices, holes, dimensions, triangles);
      let len = triangles.length
      let array = []
      // eslint-disable-next-line no-redeclare
      for (var i = 0; i < len; i++) {
        var index = triangles[i]
        array.push(list[index].x)
        array.push(list[index].y)
      }
      addCountyLayer(this.map, array, len)
    }
  },
  destoryed() {
    this.show = false
  }
}
</script>

<!-- <style lang="less" scoped>
@width: 100/1920vw;
@height: 100/1080vh;

.largeScreenMap {
  // height: 560 * @height;
  height: 100vh;

  .btn {
    position: absolute;
    top: 10px;
    margin-left: 35 * @width;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    padding: 0 5px;
    border-radius: 5px;
    background: rgba(0, 101, 206, 0.1);
    border: 1px solid rgba(5, 196, 255, 0.5);

    span {
      color: #fff;
      margin-left: 4 * @width;
    }

    .img {
      margin-top: -4 * @height;
      vertical-align: middle;
    }

    .ele {
      position: absolute;
      left: 1100 * @width;
      display: inline-block;
    }
  }

  .top-map {
    // height: 560 * @height;
    height: 100vh;
  }
}
// .mapboxgl-popup {
//   max-width: 400px;
//   font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
// }
::v-deep .mapboxgl-popup-anchor-bottom,
.mapboxgl-popup-anchor-bottom-left,
.mapboxgl-popup-anchor-bottom-right {
  flex-direction: column-reverse;
}
::v-deep .mapboxgl-popup {
  display: flex;
  left: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  will-change: transform;
  opacity: 0.8;
}
::v-deep .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
  align-self: center;
  border-bottom: none;
  border-top-color: #fff;
}
::v-deep .mapboxgl-popup-tip {
  border: 10px solid transparent;
  height: 0;
  width: 0;
  z-index: 1;
}
::v-deep .mapboxgl-popup-content {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 10px 10px 15px;
  pointer-events: auto;
  position: relative;
}

/deep/.mapboxgl-canvas {
  outline: none;
}
</style> -->
