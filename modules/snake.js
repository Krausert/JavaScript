/* 
- 蛇实例具有的属性:
  - snake: 蛇数据 初始值: [[0,1,'yellow',null],[1,1,'yellow',null],[2,1,'red',null]] 
  - direct: 移动方向 默认 'right'
    - 约定方向: 左'left' 上'up' 右'right' 下'down'
  - prevDirect: 上一格移动方向
  - size: 蛇节尺寸和食物尺寸保持一致
  - getNum: 吃到食物个数
- 蛇实例可用的方法:
  - show: 显示渲染蛇节(创建蛇节DOM并追加地图,如果蛇节DOM存在,则渲染定位样式)
  - run: 蛇移动一格蛇节坐标变化
  - eat: 蛇吃到食物判断
  - die: 游戏结束    
*/
import '../jquery/jquery.js';
export default class Snake {
  constructor() {
    this.snake = [[0, 1, 'yellow', null], [1, 1, 'yellow', null], [2, 1, 'red', null]];
    this.direct = 'right';
    this.prevDirect = 'right';
    this.size = 20;
    this.getNum = 0
  }
  show(gameMap) {
    // console.log( this.snake )
    this.snake.forEach(item => {
      // console.log(item)
      if (!item[3]) {
        item[3] = $('<div></div>');
        item[3].css({
          width: this.size + 'px',
          height: this.size + 'px',
          position: 'absolute',
          left: item[0] * this.size + 'px',
          top: item[1] * this.size + 'px',
          // 移除设置背景颜色
          // backgroundColor: item[2],
          // 添加设置背景图片的样式
          backgroundImage: 'url(./snake-img/body.png)',
          backgroundPosition: '-2px -2px',
        })
        // 追加到地图
        gameMap.append(item[3]);
      } else {
        // 蛇节DOM存在则只设置定位样式
        item[3].css({
          left: item[0] * this.size + 'px',
          top: item[1] * this.size + 'px',
        })
      }
    })

    this.snake.at(-1)[3].css({
      zIndex: 99,
      // 根据移动方向设置背景图片地址
      backgroundImage: `url(./snake-img/head-${this.direct}.png)`,
    })
  }
  run(food, gameMap) {
    /* 
      - 蛇在地图中是一格一格的移动
      - 蛇每移动一格那么蛇节的坐标会发生变化
        - 除了蛇头的其他坐标: 后一个蛇节继承了前一个蛇节坐标
        - 蛇头坐标变化: 和移动方向有关
          - 移动方向 向右 则蛇头坐标 x+1
          - 移动方向 向左 则蛇头坐标 x-1
          - 移动方向 向上 则蛇头坐标 y-1
          - 移动方向 向下 则蛇头坐标 y+1
    */
    //  除了蛇头的其他坐标: 后一个蛇节继承了前一个蛇节坐标
    for (let i = 0; i < this.snake.length - 1; i++) {
      this.snake[i][0] = this.snake[i + 1][0]
      this.snake[i][1] = this.snake[i + 1][1]
    }
    // this.snake.at(-1)
    // console.log(this.direct)
    // 蛇头坐标变化: 和移动方向有关
    switch (this.direct) {
      case 'left': this.snake.at(-1)[0]--; break;
      case 'right': this.snake.at(-1)[0]++; break;
      case 'up': this.snake.at(-1)[1]--; break;
      case 'down': this.snake.at(-1)[1]++; break;
    }

    // 坐标变化后 再次展示
    this.show(gameMap)
    // 移动一个完毕,则将这一格移动方向记录
    this.prevDirect = this.direct;

    // 每次移动判断是否吃到食物
    if (this.eat(food, gameMap)) this.getNum++;
  }
  eat(food, mapDOM) { // 吃到食物判断
    // food接受食物实例对象  mapDOM接受地图DOM
    if (this.snake.at(-1)[0] === food.x && this.snake.at(-1)[1] === food.y) {
      // 注意: food.food中 前一个food是食物实例对象,后一个是属性food表示食物的DOM元素
      food.food.remove();
      food.show(mapDOM);
      // 蛇长度+1 在蛇数组最前添加一个数组---> 添加一个蛇节-->坐标随意,因为在下一格移动时候,会自动继承前一个蛇节的坐标
      this.snake.unshift([-1, -1, 'yellow', null]);
      return true; // 如果吃到食物则返回 true
    }
  }
  die() { // 游戏结束判断 --- 如果游戏结束则返回布尔值true
    // 蛇头碰到蛇身
    for (let i = 0; i < this.snake.length - 1; i++) {
      if (this.snake.at(-1)[0] == this.snake[i][0] && this.snake.at(-1)[1] == this.snake[i][1]) return true;
    }

    // 蛇头超出范围
    if (this.snake.at(-1)[0] < 0 || this.snake.at(-1)[1] < 0 || this.snake.at(-1)[0] > 49 || this.snake.at(-1)[1] > 34) return true
  }
}
