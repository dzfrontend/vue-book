/**
 * 将notice组件封装成插件形式
 * 使用this.$notice({ title: '', message: '', duration: 3000 })
 */

import Notice from "@/components/notice/Notice";
import create from '@/utils/create';

export default {
  install(Vue) {
    Vue.prototype.$notice = (options) => {
      const comp = create(Notice, options);
      comp.show();
      return comp;
    }
  }
}