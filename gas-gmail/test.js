const exports = GASUnit.exports
const assert = GASUnit.assert
 
function test() {
  exports({
    'sum': {
      '1 + 2 = 3': () => {
        assert(sum(1, 2) === 3)
      },
    },
    'hello': {
      'Hello world!': () => {
        assert(hello('world!') === 'Hello world!')
      }
    } 
  })
}