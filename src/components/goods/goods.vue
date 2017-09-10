<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods"
            class="menu-item"
            :class="{'current': menuCurrentIndex === index}"
            @click="selectMenu(index,$event)"
        >
          <span class="text border-1px">
            <icon-map v-show="item.type>0" :iconType="item.type"></icon-map>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
              <div class="icon">
                <img width="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control :food="food" @cartAdd="cartAdd"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shop-cart :select-foods="selectFoods"
               :delivery-price="seller.deliveryPrice"
               :min-price="seller.minPrice"
               ref="shopCart"
    >
    </shop-cart>
    <food :food="selectedFood" ref="food" @cartAdd="cartAdd"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import iconMap from '../../components/iconMap/iconMap.vue'
  import BScroll from 'better-scroll'
  import shopCart from '../shopCart/shopCart.vue'
  import cartControl from '../cartControl/cartControl.vue'
  import food from '../food/food.vue'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],  // 商品信息
        listHeight: [],  // 初始化列表高度
        scrollY: 0,  // 滚动y方向的变化的值（通过Math.abs取正值）
        selectedFood: {}
      }
    },
    computed: {
      // 计算左侧menu对应右侧的下标
      menuCurrentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let topHeight = this.listHeight[i];
          let bottomHeight = this.listHeight[i + 1];
          // 当位于区间上下高度内，且不是最后一个区间的时候，返回i
          if (!bottomHeight || (this.scrollY >= topHeight && this.scrollY < bottomHeight)) {
            return i;
          }
        }
        return 0;
      },
      // 监测food.count属性是否存在，与购物车做联动
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      this.axios.get('static/data.json').then((res) => {
        if (res.status == 200) {
          this.goods = res.data.goods;
          // 保证DOM已经渲染完毕
          this.$nextTick(() => {
            this._initScroll();  // 初始化scroll
            this._calculateHeight();  // 初始化列表高度的列表
          });
        }
      });
    },
    methods: {
      // 初始化滚动
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3  // 实时监听滚动的位置
        });
        // 监控滚动事件
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        })
      },
      // 初始化列表的高度
      _calculateHeight() {
        // 获取每个li列表项
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        // 从第一项li的top高度开始push
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      // 点击menu滚动
      selectMenu(index, event) {
        // 阻止浏览器原生的点击事件
        // event._constructed是better-scroll自定义的点击派发事件
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        // 利用better-scroll的接口进行滚动
        // this.foodsScroll.scrollTo(0, -this.listHeight[index], 300);
        this.foodsScroll.scrollToElement(el, 300);
      },
      // 监听从cartControl子组件传递上来的"+"小球飞入事件
      cartAdd(target) {
        this.$refs.shopCart.drop(target);
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        // 调用子组件方法
        this.$refs.food.show();
      }
    },
    components: {
      'IconMap': iconMap,
      'ShopCart': shopCart,
      'CartControl': cartControl,
      food
    }
  }
</script>

<style lang="stylus" type="text/stylus" ref="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height: 14px
        padding: 0 12px
        border-1px(rgba(7, 17, 27, .1))
        &.current
          position: relative
          margin-top: -1px
          z-index: 10
          background: #fff
          font-weight: 700
          .text
            border-none()
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          font-size: 12px
          text-align: center
          .iconMap
            vertical-align: top
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, .1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          width: 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            font-size: 14px
            line-height: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            margin-bottom: 8px
            font-size: 10px
            line-height: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
          .extra
            .count
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
            right: 0
            bottom: 12px
</style>
