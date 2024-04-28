/* 
游戏对象具有的属性和可以使用的方法
  - 属性
    - gameMap: 地图实例对象
    - food: 食物实例对象
    - snake: 蛇实例对象
    - timerId: 定时器标识
    - speed: 速度 初始速度50 分为10份 定时器中的间隔时间 speed/10 * 100 ==> 500ms
    - defaultSpeed: 默认速度 50 
  - 方法
    - start: 游戏开始界面
    - run: 蛇移动
    - over: 游戏结束界面
    - checkDirect: 校验按键是否是方向按键
    - changeSpeed: 根据蛇长度修改蛇速度
*/
// 游戏模块
// 导入地图,食物,蛇,jq模块
import GameMap from "./gameMap.js";
import Food from './food.js'
import Snake from './snake.js'
import '../jquery/jquery.js'
// 默认导出游戏类
export default class Game {
  constructor(selector) {
    // 实例化游戏地图----传递游戏地图容器选择器
    this.gameMap = new GameMap(selector);
    // 实例化食物类----传递游戏地图容DOM
    this.food = new Food(gameMap.map);
    // 实例化蛇类----传递游戏地图容DOM
    this.snake = new Snake(gameMap.map);
    this.timerId = null; // 定时器标识
    this.speed = 50; // 速度，将1s划分成10等分，默认1s一次（当前速度）
    this.defaultSpeed = 50; // 默认速度 
    this.start();
  }
  start() {
    // 如果是重新开始则先将地图内的元素清空
    this.gameMap.map.empty();
    // 重新开始---重新实例化      
    // 实例化食物类----传递游戏地图容DOM
    this.food = new Food(this.gameMap.map);
    // 实例化蛇类----传递游戏地图容DOM
    this.snake = new Snake(this.gameMap.map);

    // 创建一个开始元素 按钮
    let $start = $('<div><button>开始</button></div>');
    // 设置开始元素样式
    $start.css({
      width: 100,
      height: 50,
      backgroundColor: 'skyblue',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translateX(-50%) translateY(-50%)',
      textAlign: 'center',
      lineHeight: '50px',
      borderRadius: '10px'
    })
    // 设置开始按钮元素样式并绑定点击事件
    $start.find('button').css({
      cursor: 'pointer',
      width: '60px',
      height: '30px',
      borderRadius: '5px'
    }).click(() => {
      // 食物和蛇显示
      this.food.show(this.gameMap.map);
      this.snake.show(this.gameMap.map);
      // 蛇连续移动
      this.run();
      $start.remove();

      $(window).off('keydown').off('keyup'); // 再次开始则将之前的事件解绑
      // 给页面键盘事件 ---> 按键控制方向
      $(window).keydown(({ keyCode }) => { // 此处解构赋值事件对象中的keyCode按键键码
        // 判断键盘按下的是 方向按键 并且按键的间隔事件小于 500ms
        if (this.keyDownTime && this.checkDirect(keyCode) && Date.now() - this.keyDownTime < 500) {
          // 间隔时间小于500ms，加速
          this.speed -= 5;
          // 保持最快速度为3==> 30ms每次
          if (this.speed < 3) this.speed = 3
        }
        // 记录当前按下的时间
        this.keyDownTime = Date.now();
        // console.log(keyCode, snake.prevDirect) 
        // 左37 上38 右39 下40
        // 根据键码判断按下键
        switch (keyCode) {
          // 根据上一格移动方向判断
          case 37: this.snake.direct = this.snake.prevDirect == 'right' ? 'right' : 'left'; break;
          case 38: this.snake.direct = this.snake.prevDirect == 'down' ? 'down' : 'up'; break;
          case 39: this.snake.direct = this.snake.prevDirect == 'left' ? 'left' : 'right'; break;
          case 40: this.snake.direct = this.snake.prevDirect == 'up' ? 'up' : 'down'; break;
        }

        // 按键按下后每次都重新执行一下run移动
        this.run();
      }).keyup(() => {
        // 键盘松开则改变速度
        this.changeSpeed();
        this.run();
      })
    })
    this.gameMap.map.append($start);
  }
  run() {
    // 长按则清除之前的定时器
    this.timerId && clearInterval(this.timerId);
    // 使用定时器 连续移动
    this.timerId = setInterval(() => {
      this.snake.run(this.food, this.gameMap.map);
      // 游戏结束
      if (this.snake.die()) this.over(this.snake.getNum);
    }, this.speed / 10 * 100);
  }
  over(score) {
    clearInterval(this.timerId);
    // this.gameMap.map.empty();
    let $gameOver = $(`
      <div class='over'>
        <div>游戏结束</div>
        <span>得分: <b>${score}</b></span>
        <button>重新开始</button>
      </div>
    `);
    // 设置结束界面的样式
    $gameOver.css({
      width: '100px',
      height: '200px',
      backgroundColor: 'deepskyblue',
      opacity: '.8',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translateX(-50%) translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      padding: '0 20px',
      fontSize: '20px',
      borderRadius: '10px',
      zIndex: 100
    }).find('div').css({
      color: 'red',
      fontWeight: 'bold',
    })
    $gameOver.find('b').css({
      color: 'yellow',
      fontWeight: 'bold',
    })
    $gameOver.find('button').css({
      height: '35px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '18px',
    }).click(() => {
      // 结束界面 重新开始按钮的点击事件
      this.start(); // 重新开始
    })
    this.gameMap.map.append($gameOver);
  }
  checkDirect(keyCode) { // 校验按键是否是方向按键
    if (keyCode == 37 && this.snake.direct == 'left' || keyCode == 38 && this.snake.direct == 'up' || keyCode == 39 && this.snake.direct == 'right' || keyCode == 40 && this.snake.direct == 'down') return true;
    return false
  }
  changeSpeed() {
    // 修改速度  贪吃蛇没吃到一个食物，移动速度会增加
    this.speed = this.defaultSpeed - this.snake.snake.length + 3;
    // 不超过最快速度
    this.speed < 3 && (this.speed = 3)
  }
}