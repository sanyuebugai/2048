$(function(){
  var items = [];
  var bStart = false;
  var startPos = {};
  var endPos = {};
  var direction = null;
  var emptyItem = [];//存放当前空白格子的索引

  var oPage = {
    init: function(){
      this.render(0);
      this.listen();
    },
    listen: function(){
      var self = this;
      $('#start').on('click', function() {
        bStart = true;
        emptyItem = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        self.render(0);
        self.randomAdd(3);
      });
      $('#box ul').on('touchstart', function(event) {
        self.mouseStart(event);
      });
      $('#box ul').on('touchend', function(event) {
        self.mouseEnd(event);
      });
    },
    randomAdd: function(num){//随机生成新的数字
      emptyItem.sort( function(){ return 0.5 - Math.random() } );
      for( var i = 0; i < num; i++){
        var random = Math.random();
        var j = emptyItem[i];
        if(random > 0.9){
          items[j] = 4;
        } else{
          items[j] = 2;
        }
        var str = "<p>" + items[j] + "</p>";
        $('#box li').eq(j).html(str);
      }
    },
    render: function(type){//渲染，type=0为重置
      var self = this;
      if(type == 0){
        for(var i = 0; i < 16; i++){
          items[i] = 0;
          $('#box li').eq(i).html('');
        }
      } else{
        var fail = true;
        emptyItem = [];
        for(var i = 0; i < items.length; i++){
          if(items[i] > 0){
            var str = "<p>" + items[i] + "</p>";
            $('#box li').eq(i).html(str);
          } else{
            fail = false;
            emptyItem.push(i);
            $('#box li').eq(i).html('');
          }
        }
        if(fail){
          alert('失败');
        } else{
          setTimeout(function(){
            self.randomAdd(1);
          }, 300)
        }
      }
    },
    mouseStart: function(ev){
      var self = this;
      ev = ev || window.event;
      if( bStart){
        var touch = ev.originalEvent.targetTouches[0];
        startPos = {
          x: Number(touch.pageX),
          y: Number(touch.pageY)
        };
      }
    },
    mouseEnd: function(ev){
      var self = this;
      if( bStart ){
        var touch = ev.originalEvent.changedTouches[0];
        endPos = {
          x: Number(touch.pageX),
          y: Number(touch.pageY)
        };
        var xTemp = Math.abs(startPos.x - endPos.x);
        var yTemp = Math.abs(startPos.y - endPos.y);
        if(xTemp > yTemp){//横向偏移量大于纵向偏移量
          if(startPos.x > endPos.x){ 
            console.log('左滑') 
            self.changeContent(0);
          } else{
            console.log('右滑') 
            self.changeContent(1);
          }
        } else {
          if(startPos.y > endPos.y){ 
            console.log('上滑') 
            self.changeContent(2);
          } else{
            console.log('下滑') 
            self.changeContent(3);
          }
        }
      }
    },
    changeContent(type){
      var self = this;
      // 0-左滑 1-右滑 2-上滑 3-下滑
      var arrTemp = [[],[],[],[]];
      // 划分数组
      if(type < 2){
        for(var i = 0; i < 16; i++){
          var t = Math.floor(i / 4);
          arrTemp[t].push(items[i]);
        }
      } else{
        for(var i = 0; i < 16; i++){
          var t = i % 4;
          arrTemp[t].push(items[i]);
        }
      }
      // 处理遍历顺序
      if(type == 1 || type == 3){//逆序遍历
        for(var i = 0; i < 4; i++){
          var zero = -1;//标记0的位置
          var num = -1;//标记待相加的数字位置
          for(var j = 3; j > -1; j--){
            if(arrTemp[i][j] == 0 && zero < 0){
              zero = j;
            }
            if(arrTemp[i][j] > 0 && num < 0){
              num = j;
            }
            if(arrTemp[i][j] > 0 && num > -1 && j!=num){
              if( arrTemp[i][j] == arrTemp[i][num]){
                arrTemp[i][num] = arrTemp[i][num] * 2;
                arrTemp[i][j] = 0;
                if(zero < 0) zero = j;
              }
              var f = false
              for(var p = j; p > -1; p--){
                if(arrTemp[i][p] > 0 && !f){
                  num = p;
                  f = true;
                }
              }
            }
            if(arrTemp[i][j] > 0 && zero > -1){
              arrTemp[i][zero] = arrTemp[i][j];
              arrTemp[i][j] = 0;
              if(num == j) num = zero;
              var f = false
              for(var p = zero; p > -1; p--){
                if(arrTemp[i][p] == 0 && !f){
                  zero = p;
                  f = true;
                }
              }
            }
            // console.log(arrTemp)
          }
        }
      } else{//顺序遍历
        for(var i = 0; i < 4; i++){
          var zero = -1;//标记0的位置
          var num = -1;//标记待相加的数字位置
          for(var j = 0 ; j < 4; j++){
            if(arrTemp[i][j] == 0 && zero < 0){
              zero = j;
            }
            if(arrTemp[i][j] > 0 && num < 0){
              num = j;
            }
            if(arrTemp[i][j] > 0 && num > -1 && j!=num){
              if( arrTemp[i][j] == arrTemp[i][num]){
                arrTemp[i][num] = arrTemp[i][num] * 2;
                arrTemp[i][j] = 0;
                if(zero < 0) zero = j;
              }
              var f = false
              for(var p = j; p < 4; p++){
                if(arrTemp[i][p] > 0 && !f){
                  num = p;
                  f = true;
                }
              }
            }
            if(arrTemp[i][j] > 0 && zero > -1){
              arrTemp[i][zero] = arrTemp[i][j];
              arrTemp[i][j] = 0;
              if(num == j) num = zero;
              var f = false
              for(var p = zero; p < 4; p++){
                if(arrTemp[i][p] == 0 && !f){
                  zero = p;
                  f = true;
                }
              }
            }
            // console.log(arrTemp)
          }
        }
      }
      console.log(arrTemp)
      // 数组还原
      items = [];
      if(type < 2){
        items = arrTemp[0].concat(arrTemp[1]).concat(arrTemp[2]).concat(arrTemp[3]);
      } else{
        for(var i = 0; i < arrTemp.length; i++){
          for(var j = 0 ; j < arrTemp[0].length; j++){
            var n = j * 4 + i;
            items[n] = arrTemp[i][j];
          }
        }
      }
      console.log(items);
      self.render();
    },
  }
  oPage.init();
});