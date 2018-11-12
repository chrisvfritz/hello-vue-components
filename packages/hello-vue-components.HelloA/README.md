# hello-vue-components.HelloA

> A component that says "HelloA" with orange text.

## Installation

### Directly in the browser

Drop the component in with a `<script>` tag alongside Vue:

```html
<div id="app">
<!-- ... use component here ... -->
</div>

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/hello-vue-components.HelloA"></script>
<script>
new Vue({ el: '#app' })
</script>
```

### In a module system

Install the component with NPM:

```bash
npm install hello-vue-components.HelloA
```

Then import the component:

```js
import HelloA from 'hello-vue-components.HelloA'
```

And either globally register it for use in all components:

```js
Vue.component(HelloA, 'hello-vue-components.HelloA')
```

or locally register it for use in an individual component:

```js
export default {
components: { HelloA }
}
```

## Usage

```html
<!-- No props or content are necessary. -->
<hello-a></hello-a>
```
