<template>
  <transition name="backdrop">
    <div class="backdrop" v-show="isShow"></div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style lang="stylus" type="text/stylus">
  .backdrop
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: rgba(7, 17, 27, .6)
    backdrop-filter: blur(10px)
    z-index: 40
    opacity: 1
    &.backdrop-enter-active, &.backdrop-leave-active
      transition: opacity 0.5s
      background: rgba(7, 17, 27, .6)
    &.backdrop-enter, &.backdrop-leave-active
      opacity: 0
      background rgba(7, 17, 27, 0)
</style>
