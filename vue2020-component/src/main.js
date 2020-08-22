import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'

Vue.config.productionTip = false
// 事件总线
// Vue.prototype.$bus = new Vue()

// Bus：事件派发、监听和回调管理
class Bus {
  constructor(){
    this.callbacks = {}  
  }  
  $on(name, fn){
    this.callbacks[name] = this.callbacks[name] || []
    this.callbacks[name].push(fn)  
  }  
  $emit(name, args){
    if(this.callbacks[name]){
      this.callbacks[name].forEach(cb => cb(args))    
    }  
  }
}

Vue.prototype.$bus = new Bus()

new Vue({
  render: h => h(App),
}).$mount('#app')
