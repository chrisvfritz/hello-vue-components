import HelloB from './HelloB'

test('exports a valid component', () => {
  expect(HelloB).toBeAComponent()
})

test('renders the text "HelloB"', () => {
  const { element } = shallowMount(HelloB)
  expect(element.textContent.trim()).toBe('HelloB')
})

test('adds a "hello" class on the root element', () => {
  const { element } = shallowMount(HelloB)
  expect(element.classList.contains('hello')).toBe(true)
})
