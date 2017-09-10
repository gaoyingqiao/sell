<template>
  <div class="cart-control">
    <transition name="move">
      <div class="cart-decrease"
           v-show="food.count>0"
           @click.stop.prevent="decreaseCart($event)"
      >
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed) {
          // 去掉自带的click事件点击
          return;
        }
        if (!this.food.count) {
          // 添加一个原本不存在的属性 -> set
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('cartAdd', event.target);  // 当前操作的dom对象
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus">
  .cart-control
    font-size: 0
    .cart-decrease
      display: inline-block
      padding: 6px /* 增加可点击区域 -> 提高用户体验*/
      transition: all .4s linear
      .inner
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
        transition: all .4s linear
      &.move-enter-active, &.move-leave-active
        transform: translate3D(0, 0, 0) /*开启硬件加速*/
        .inner
          display: inline-block
          transform: rotate(0)
      &.move-enter, &.move-leave-active
        transform: translate3D(24px, 0, 0)
        opacity: 0
        .inner
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      font-size: 10px
      line-height: 24px
      text-align: center
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0, 160, 220)
</style>
