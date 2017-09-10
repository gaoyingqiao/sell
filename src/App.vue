<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue'
  import {urlParse} from './common/js/util'

  export default {
    data() {
      return {
        seller: {
          // 模拟id
          id: (() => {
            let queryParams = urlParse();
            return queryParams.id;
          })()
        },  // 商家信息
      }
    },
    created() {
      this.axios.get('static/data.json').then((res) => {
        if (res.status == 200) {
          // 给对象附加属性
          this.seller = Object.assign({}, this.seller, res.data.seller);
        }
      })
    },
    components: {
      'VHeader': header
    }
  }
</script>

<style lang="stylus" type="text/stylus" ref="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, .1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block /*使得这一块都有效果，a标签撑满整个盒子*/
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
