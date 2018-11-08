import HelloA from './HelloA'

test('exports a valid component', () => {
  expect(HelloA).toBeAComponent()
})

test('renders the text "HelloA"', () => {
  const { element } = shallowMount(HelloA)
  expect(element.textContent.trim()).toBe('HelloA')
})

test('adds a "hello" class on the root element', () => {
  const { element } = shallowMount(HelloA)
  expect(element.classList.contains('hello')).toBe(true)
})
