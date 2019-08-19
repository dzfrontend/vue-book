// getters：状态的计算属性，和computed概念类似，只不过计算后的数据是公共的

export default {
  getNewData(state) {
    return 'getters ' + state.data
  }
}