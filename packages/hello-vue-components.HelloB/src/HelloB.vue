<template>
  <div :class="$style.hello">
    HelloB
  </div>
</template>

<style module>
.hello {
  color: green;
}
</style>

<meta>
{
  "description": "A component that says \"HelloB\" with green text."
}
</meta>

<example>
  <!-- No props or content are necessary. -->
  <hello-b></hello-b>
</example>
