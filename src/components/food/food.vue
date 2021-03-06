<template>
  <transition name="move">
    <div class="food-wrapper" v-show="showFlag" ref="foodWrapper">
      <div class="food-content">
        <div class="image-header">
          <img width="100%" height="100%" :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">¥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
          </div>
          <div class="cart-control-wrapper">
            <cart-control :food="food" @cartAdd="addFood"></cart-control>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count == 0" @click.stop.prevent="addToCart($event)">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <rating-select :ratings="food.ratings"
                         :selectType="selectType"
                         :onlyContent="onlyContent"
                         :desc="desc"
                         @select="selectRating"
                         @toggle="toggleContent"
          >
          </rating-select>
          <!--评价列表-->
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li class="rating-item border-1px"
                  v-for="rating in food.ratings"
                  v-show="needShow(rating.rateType,rating.text)"
              >
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up': rating.rateType===0, 'icon-thumb_down': rating.rateType===1}"></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import cartControl from '../cartControl/cartControl.vue'
  import split from '../split/split.vue'
  import ratingSelect from '../ratingSelect/ratingSelect.vue'
  import {formatDate} from '../../common/js/date'

  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    methods: {
      show() {
        this.showFlag = true;
        // 由于可能会被多个页面使用，需要保证在初始化时数据渲染正确
        this.selectType = ALL;
        this.onlyContent = true;
        this.$nextTick(() => {
          this._initScroll();
        })
      },
      hide() {
        this.showFlag = false;
      },
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodWrapper, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      // 添加第一个商品
      addToCart(event) {
        if (!event._constructed) {
          return;
        }
        Vue.set(this.food, 'count', 1);
        this.$emit('cartAdd', event.target);
      },
      // 对cart-control组件再次进行$emit事件派发
      addFood(target) {
        this.$emit('cartAdd', target);
      },
      selectRating(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      toggleContent() {
        this.onlyContent = !this.onlyContent;
        // 由于内容的高度会发生变化 -> 需要异步更新dom -> refresh
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      needShow(type, text) {
        // 当选择有内容的评论，且内容为空
        if (this.onlyContent && !text) {
          return false;
        }
        if (this.selectType === ALL) {  // 选择类型是全部
          return true;
        } else {  // 选择类型与当前类型是否一致
          return type === this.selectType;
        }
      }
    },
    components: {
      'CartControl': cartControl,
      split,
      'RatingSelect': ratingSelect
    }
  }
</script>

<style lang="stylus" type="text/stylus">
  @import "../../common/stylus/mixin.styl"

  .food-wrapper
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 30
    width: 100%
    background: #fff
    &.move-enter-active, &.move-leave-active
      transition: all 0.4s linear
      transform translate3d(0, 0, 0)
    &.move-enter, &.move-leave-active
      transform translate3d(100%, 0, 0)
    .food-content
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100% /* 通过"padding-top: 100%"可以设置宽=高=100%的盒子 */
        img
          position: absolute
          top: 0
          left: 0
          width 100%
          height: 100%
        .back
          position: absolute
          top: 10px
          left: 0
          .icon-arrow_lift
            display: block
            padding: 10px
            font-size: 20px
            color: #fff
      .content
        position: relative
        padding: 18px
        .title
          line-height: 14px
          margin-bottom: 8px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .detail
          margin-bottom: 18px
          line-height: 10px
          font-size: 0
          height: 10px
          .sell-count, .rating
            font-size: 10px
            color: rgb(147, 153, 159)
          .sell-count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          font-size: 0
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            text-decoration: line-through
            font-size: 10px
            color: rgb(147, 153, 159)
        .cart-control-wrapper
          position: absolute
          right: 12px
          bottom: 12px
        .buy
          position: absolute
          right: 18px
          bottom: 18px
          z-index: 10
          height: 24px
          line-height: 24px
          padding: 0 12px
          box-sizing: border-box
          font-size: 10px
          border-radius: 12px
          color: #fff
          background: rgb(0, 160, 220)
          &.fade-enter-active, &.fade-leave-active
            transition opacity .2s
          &.fade-enter, &.fade-leave-active
            opacity 0
      .info
        padding: 18px
        .title
          margin-bottom: 6px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .text
          padding: 0 8px
          line-height: 24px
          font-size: 12px
          color: rgb(77, 85, 93)
      .rating
        padding-top: 18px
        .title
          margin-left: 18px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .rating-wrapper
          padding: 0 18px
          .rating-item
            position: relative
            padding: 16px 0
            border-1px(rgba(7, 17, 27, .1))
            .user
              position: absolute
              top: 18px
              right: 0
              line-height: 12px
              font-size: 0
              .name
                display: inline-block
                vertical-align: top
                font-size: 10px
                color: rgb(147, 153, 159)
                margin-right: 6px
              .avatar
                border-radius: 50%
            .time
              margin-bottom: 6px
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
            .text
              line-height: 16px
              font-size: 12px
              color: rgb(7, 17, 27)
              .icon-thumb_up, .icon-thumb_down
                margin-right: 4px
                line-height: 16px
                font-size: 12px
              .icon-thumb_up
                color: rgb(0, 160, 220)
              .icon-thumb_down
                color: rgb(147, 153, 159)
          .no-rating
            padding: 16px 0
            font-size: 12px
            color: rgb(147, 153, 159)
</style>
