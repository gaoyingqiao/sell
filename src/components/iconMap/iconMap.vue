<template>
  <span class="iconMap" :class="iconClassMap[iconType]"></span>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      iconType: {
        type: Number
      }
    },
    created() {
      // // 对应的type的值对应的class名
      this.iconClassMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    }
  }
</script>

<style lang="stylus" type="text/stylus">
  @import "../../common/stylus/mixin.styl"

  .iconMap
    display: inline-block
    background-size: 100% 100%
    background-repeat: no-repeat
    width: 12px
    height: 12px
    &.decrease
      bg-image('decrease_3')
    &.discount
      bg-image('discount_3')
    &.guarantee
      bg-image('guarantee_3')
    &.invoice
      bg-image('invoice_3')
    &.special
      bg-image('special_3')
</style>
