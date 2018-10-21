<template>
  <div id="app">
    <HelloA/>
    <HelloB/>
  </div>
</template>

<script>
import HelloA from './components/HelloA'
import HelloB from './components/HelloB'

export default {
  components: {
    HelloA,
    HelloB
  }
}
</script>
