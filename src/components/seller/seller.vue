<template>
  <div class="seller-wrapper" ref="sellerWrapper">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <span class="icon-favorite" :class="{'active': favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <!--公告与活动-->
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
      </div>
      <div class="supports">
        <ul>
          <li class="support-item border-1px" v-for="item in seller.supports">
            <icon-map class="icon" :iconType="item.type"></icon-map>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <!--商家实景-->
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pics-wrapper" ref="picsWrapper">
          <ul ref="picList">
            <li class="pic" v-for="item in seller.pics">
              <img :src="item" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <!--商家信息-->
      <div class="infos-wrapper">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info border-top-1px" v-for="item in seller.infos">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  import iconMap from '../iconMap/iconMap.vue'
  import {saveToLocal, loadFromLocal} from '../../common/js/store'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        // favorite: false
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      }
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    watch: {
      // 由于seller是异步获取的，需要通过watch来监听
      // 当tab栏进行切换的时候，由于dom已经渲染过，导致切回到'商家'时滚动不奏效
      // 需在mounted中进行事件的调用
      'seller'() {
        this.$nextTick(() => {
          this._initScroll();
          this._initPicsScroll();
        })
      }
    },
    methods: {
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.sellerWrapper, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPicsScroll() {
        // 手动设置ul宽度
        if (this.seller.pics) {
          let picWidth = 120;
          let marginRight = 6;
          let width = (picWidth + marginRight) * this.seller.pics.length - marginRight;
          this.$refs.picList.style.width = width + 'px';
          if (!this.picsScroll) {
            this.picsScroll = new BScroll(this.$refs.picsWrapper, {
              scrollX: true,
              eventPassthrough: 'vertical'
            });
          } else {
            this.picsScroll.refresh();
          }
        }
      },
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        // 存储到本地
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      }
    },
    mounted() {
      this._initScroll();
      this._initPicsScroll();
    },
    components: {
      star,
      split,
      'IconMap': iconMap
    }
  }
</script>

<style lang="stylus" type="text/stylus">
  @import "../../common/stylus/mixin.styl"

  .seller-wrapper
    position: absolute
    top: 174px
    left: 0
    bottom: 0
    width: 100%
    overflow: hidden
    .seller-content
      .overview
        padding: 18px
        .title
          margin-bottom: 8px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .desc
          padding-bottom: 18px
          font-size: 0
          border-1px(rgba(7, 17, 27, .1))
          .star
            display: inline-block
            vertical-align: top
            margin-right: 8px
          .text
            display: inline-block
            vertical-align: top
            margin-right: 12px
            line-height: 18px
            font-size: 10px
            color: rgb(77, 85, 93)
        .remark
          display: flex
          padding-top: 18px
          .block
            flex: 1
            text-align: center
            border-right: 1px solid rgba(7, 17, 27, .1)
            &:last-child
              border: none
            h2
              margin-bottom: 4px
              line-height: 10px
              font-size: 10px
              color: rgb(147, 153, 159)
            .content
              line-height: 24px
              font-size: 10px
              color: rgb(7, 17, 27)
              .stress
                font-size: 24px
        .favorite
          position: absolute
          top: 18px
          right: 11px
          width: 50px
          text-align: center
          .icon-favorite
            display: block
            margin-bottom: 4px
            line-height: 24px
            font-size: 24px
            color: #d4d6d9
            &.active
              color: rgb(240, 20, 20)
          .text
            line-height: 10px
            font-size: 10px
            color: rgb(77, 85, 93)
      .bulletin
        padding: 18px 18px 0 18px
        .title
          margin-bottom: 8px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .content-wrapper
          padding: 0 12px 16px 12px
          border-1px(rgba(7, 17, 27, .1))
          line-height: 24px
          font-size: 12px
          color: rgb(240, 20, 20)
      .supports
        margin: 0 18px
        .support-item
          padding: 16px 12px
          font-size: 0
          border-1px(rgba(7, 17, 27, .1))
          &:last-child
            border-none()
          .icon
            display: inline-block
            width: 16px
            height: 16px
            vertical-align: top
            margin-right: 6px
            background-size: 16px 16px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
            &.special
              bg-image('special_4')
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
      .pics
        padding: 18px
        .title
          margin-bottom: 12px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .pics-wrapper
          width: 100%
          overflow: hidden
          white-space: nowrap
          ul
            font-size: 0
            .pic
              display: inline-block
              margin-right: 6px
              width: 120px
              height: 90px
              &:last-child
                margin-right: 0
      .infos-wrapper
        padding: 18px 18px 0 18px
        color: rgb(7, 17, 27)
        .title
          margin-bottom: 12px
          line-height: 14px
          font-size: 14px
        .info
          padding: 16px 12px
          line-height: 16px
          font-size: 12px
          border-top-1px(rgba(7, 17, 27, 0.1))
</style>
