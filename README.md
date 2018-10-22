# hello-vue-components

> An example component library built with Vue CLI 3.

## Usage

Drop the library in with a `<script>` tag alongside Vue to globally install all components:

```html
<div id="app">
  <hello-a></hello-a>
  <hello-b></hello-b>
</div>

<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/hello-vue-components"></script>
<script>
  new Vue({ el: '#app' })
</script>
```

Or, if you are using this library in a module system, install it with NPM:

```bash
npm install hello-vue-components
```

Then register the library as a plugin to globally install all components:

```js
import HelloVueComponents from 'hello-vue-components'

Vue.use(HelloVueComponents)
```

Or, import components individually for local registration:

```js
import { HelloA, HelloB } from 'hello-vue-components'

export default {
  components: { HelloA, HelloB }
}
```

Or, if you only want to use a small subset of components, import individually bundled components from the `dist` directory to reduce the size of your application:

```js
import HelloA from 'hello-vue-components/dist/HelloA'
import HelloB from 'hello-vue-components/dist/HelloB'
```
