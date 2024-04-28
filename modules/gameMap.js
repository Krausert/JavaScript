/* 
- 地图实例具有的属性:
  - map: 获取的地图DOM元素
- 地图实例可用的方法:
  - show: 设置地图DOM的样式
*/
// 导入jq
import '../jquery/jquery.js';
export default class GameMap {
  constructor(selector) {
    this.map = $(selector);
    this.show();
  }
  show() {
    this.map.css({
      width: '1000px',
      height: '700px',
      border: '5px solid deepskyblue',
      margin: '20px auto',
      position: 'relative'
    })
  }
}


