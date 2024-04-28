/*
- 食物实例具有的属性:
  - food: 食物页面DOM元素
  - x: 食物水平坐标
  - y: 食物垂直坐标
  - size: 食物尺寸
- 食物实例可用的方法:
  - show: 创建食物DOM,设置样式(获取的随机定位)
*/
// 导入jq
import '../jquery/jquery.js';
export default class Food {
  constructor() {
    this.food = null;
    this.x = 0;
    this.y = 0;
    this.size = 20
  }
  show(gameMap) { // 接受地图DOM
    this.food = $('<div></div>');

    let xMax = Math.floor(gameMap.width() / this.size);
    let yMax = Math.floor(gameMap.height() / this.size);
    this.x = Math.floor(Math.random() * xMax);
    this.y = Math.floor(Math.random() * yMax);

    this.food.css({
      width: this.size + 'px',
      height: this.size + 'px',
      position: 'absolute',
      left: this.x * this.size + 'px',
      top: this.y * this.size + 'px',      
      // 去除背景颜色
      // backgroundColor: 'red',
      // 添加背景图片相关样式
      backgroundImage: 'url(./snake-img/food.png)',
      backgroundSize: '20px',
      backgroundRepeat: 'no-repeat',
    })

    // 追加到地图中
    gameMap.append(this.food);
    // 移动一个完毕,则将这一格移动方向记录
    this.prevDirect = this.direct;

  }

}

