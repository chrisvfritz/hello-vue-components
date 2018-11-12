# hello-vue-components.hello-b

> A component that says "HelloB" with green text.

## Installation

### Directly in the browser

Drop the component in with a `<script>` tag alongside Vue:

```html
<div id="app">
<!-- ... use component here ... -->
</div>

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/hello-vue-components.hello-b"></script>
<script>
new Vue({ el: '#app' })
</script>
```

### In a module system

Install the component with NPM:

```bash
npm install hello-vue-components.hello-b
```

Then import the component:

```js
import HelloB from 'hello-vue-components.hello-b'
```

And either globally register it for use in all components:

```js
Vue.component(HelloB, 'hello-vue-components.hello-b')
```

or locally register it for use in an individual component:

```js
export default {
components: { HelloB }
}
```

## Usage

```html
<!-- No props or content are necessary. -->
<hello-b></hello-b>
```
