<template>
  <div>
    <div class="shop-cart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount > 0}">
              <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight': totalPrice > 0}">¥{{totalPrice}}</div>
          <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container" v-for="(ball, index) in balls">
        <transition name="drop"
                    @before-enter="beforeEnter"
                    @enter="enter"
                    @after-enter="afterEnter"
        >
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <!--购物车列表-->
      <transition name="fold">
        <div class="shop-cart-list" v-show="listShow && (selectFoods.length>0)">
          <div class="list-header">
            <div class="title">购物车</div>
            <span class="empty" @click="setEmpty">清空</span>
          </div>
          <div class="list-content" ref="foodList">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥{{food.price * food.count}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control :food="food" @cartAdd="cartAdd"></cart-control>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <!--背景层-->
    <div class="backdrop-wrapper" @click="hiddenBackdrop">
      <backdrop :isShow="listShow && (selectFoods.length>0)"></backdrop>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import cartControl from '../cartControl/cartControl.vue'
  import backdrop from '../backdrop/backdrop.vue'
  import BScroll from 'better-scroll'

  export default {
    props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      selectFoods: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        balls: [
          {show: false},
          {show: false},
          {show: false},
          {show: false},
          {show: false}
        ],
        dropBalls: [],
        listShow: false,
      }
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          return `还差¥${this.minPrice - this.totalPrice}元`;
        } else {
          return '去结算';
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      }
    },
    methods: {
      // 遍历找到第一个为false的小球，让他显示
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      // 初始化scroll
      _initScroll() {
        this.foodsScroll = new BScroll(this.$refs.foodList, {
          click: true
        });
      },
      // 显示／隐藏购物车列表
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.listShow = !this.listShow;
        if (this.listShow) {
          this.$nextTick(() => {
            if (!this.foodsScroll) {
              this._initScroll();
            } else {
              this.foodsScroll.refresh();
            }
          })
        }
      },
      // 过渡动画钩子  进入中
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            el.style.transform = `translate3d(0, ${y}px, 0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      // 进入后的操作
      enter(el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;  //触发浏览器重绘，offsetWidth或offsetTop等方法都可以触发
        this.$nextTick(() => {
          el.style.webkitTransform = `translate3d(0, 0, 0)`;
          el.style.transform = `translate3d(0, 0, 0)`;
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = `translate3d(0, 0, 0)`;
          inner.style.transform = `translate3d(0, 0, 0)`;
        })
      },
      // 离开后的操作
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      // 内部自调
      cartAdd(target) {
        this.drop(target);
      },
      // 清空购物车
      setEmpty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hiddenBackdrop() {
        this.listShow = false;
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    },
    components: {
      'CartControl': cartControl,
      backdrop
    }
  }
</script>

<style lang="stylus" type="text/stylus">
  @import "../../common/stylus/mixin.styl"
  .shop-cart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      color: rgba(255, 255, 255, .4)
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative;
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background: rgb(0, 160, 222)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px rgba(0, 0, 0, .4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, .1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          background: #2b333b
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fffl
    .ball-container
      .ball
        position: fixed;
        left: 37px
        bottom: 22px
        z-index: 200
        &.drop-enter, &.drop-enter-active
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width: 16px
            height: 16px
            border-radius: 50%
            background: rgb(0, 160, 220)
            transition: all 0.4s linear
    .shop-cart-list
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      background: #fff
      transform translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition all 0.5s
        transform translate3d(0, -100%, 0)
      &.fold-enter, &.fold-leave-active
        transform translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        background: #f3f5f7
        padding: 0 18px
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          display: flex
          height: 48px
          border-1px(rgba(7, 17, 27, .1))
          .name
            flex: 1
            line-height: 48px
            font-size: 14px
            color: rgb(7, 17, 27)
            font-weight: 700
          .price
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
            padding: 0 12px 0 18px
            line-height: 48px
          .cart-control-wrapper
            font-size: 14px
            margin-top: 6px
</style>
