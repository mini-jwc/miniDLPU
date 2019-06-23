//index.js
//获取应用实例
const app = getApp();
var itemFirstDay;
//var NOWzc=0;
Page({ 
  data: {
    userid:"",
    userpwd:"",
    server:'210.30.62.37',
    indexxq: 0,
    arrayxq: ['2018-2019-2'],

    indexzc: 0, 
    indexzcAdd1: 0,
    indexzcAdd2: 1,
    arrayzc: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    indexjcAdd1: 0,
    indexjcAdd2: 2,
    arrayjc: ["1,2","3,4","5,6","7,8","9,10"],
    indexweekAdd: 0,

    isshowimg1: false,
    isshowimg2: false,
    tqimgurl1: "",
    tqimgurl2: "",
    tqtemp: "π_π", 
    hiddenmodalput: true, //课程详细
    hiddenaddkcb:true, //添加课程
    hiddeneditkcb:true, //编辑课程
    maskFlag: true,
    name:"",
    leader:"",
    room:"",
    time1: "",
    time2: "", 
    editkcbkid: "",
    editkcbname: "",
    editkcbroom: "",
    editkcbleader: "",
    arrayth: [
      { week: "周一", date: ""}, 
      { week: "周二", date: ""}, 
      { week: "周三", date: ""},
      { week: "周四", date: ""}, 
      { week: "周五", date: "" },
      { week: "周六", date: "" },
      { week: "周日", date: "" }],
    arraykcb: [],
    //设置弹窗天气
    m_today_disc: 'loading',
    m_today_temp: 'π_π',
    m_nextday_disc: 'loading',
    m_nextday_temp: 'π_π',
    
  },
  zcChange: function (e) {
    var that = this;
    that.setData({
      indexzc: e.detail.value,
    });
    that.reFreshKCB();
  },
  zcAddChange1: function (e) {
    this.setData({ 
      indexzcAdd1: e.detail.value,
      indexzcAdd2: e.detail.value
    });
  },
  zcAddChange2: function (e) {
    var that = this;
    if (e.detail.value >= that.data.indexzcAdd1){ //第二列必须大于等于第一列
      that.setData({
        indexzcAdd2: e.detail.value,
      });
    }
  },
  jcAddChange1: function (e) {
    this.setData({
      indexjcAdd1: e.detail.value,
      indexjcAdd2: e.detail.value
    });
  },
  jcAddChange2: function (e) {
    var that = this;
    if (e.detail.value >= that.data.indexjcAdd1) { //第二列必须大于等于第一列
      that.setData({
        indexjcAdd2: e.detail.value,
      });
    }
  },


  //事件处理函数
  bindViewTap: function() {
  },
  onLoad: function () {
    var that = this;
    // var isshownotice99 = wx.getStorageSync('isshownotice99');
    // if(isshownotice99 != 1){
    //   wx.showModal({
    //     content: '课程表数据方案更新完成，强烈建议立即前往“学号和密码”更换模式M1：[课程表抓取]',
    //     showCancel: true,
    //     confirmText: "知道了",
    //     cancelText: "下次通知",
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定');
    //         wx.setStorageSync('isshownotice99', 1);
    //         //停止刷新
    //         wx.stopPullDownRefresh();
    //         // 隐藏顶部刷新图标
    //         wx.hideNavigationBarLoading();
    //         wx.navigateTo({
    //           url: '../setting-detail/set-userinfo',
    //         })
    //       }
    //     }
    //   });
    //   wx.setStorageSync('isshownotice99', 0);
    // }

    wx.getStorage({key: 'userid',success: function(res) {
        that.setData({userid: res.data});},
    });
    wx.getStorage({key: 'userpwd',success: function (res) {
        that.setData({userpwd: res.data});},
    });
    //获取天气
    wx.request({
      url: 'https://test.1zdz.cn/api/getweather.php',
      success: function(res) {
        console.log(res);
        var tqimgurl1 = res.data.imgurl1;
        var tqimgurl2 = res.data.imgurl2;
        var tqimgurl21 = res.data.imgurl21;
        var tqimgurl22 = res.data.imgurl22;
        var tqtemp = res.data.templow + "~" + res.data.temphigh;
        var tqtemp2 = res.data.templow2 + "~" + res.data.temphigh2;
        if (tqimgurl2 == null) {
          that.setData({
            isshowimg1:true,
            tqimgurl1: tqimgurl1,
            tqtemp: tqtemp
          });
        }else{
          that.setData({
            isshowimg1: true,
            isshowimg2: true,
            tqimgurl1: tqimgurl1,
            tqimgurl2: tqimgurl2,
            tqtemp: tqtemp
          });
        }
        //设置弹窗天气
        var today = new Date();
        var nextday = new Date(today.getTime() + 1000*60*60*24);
        that.setData({
          m_today: (today.getMonth() + 1) + '月' + today.getDate() + '日',
          m_nextday: (nextday.getMonth() + 1) + '月' + nextday.getDate() + '日',
          m_today_disc: res.data.disc,
          m_today_temp: tqtemp,
          m_nextday_disc: res.data.disc2,
          m_nextday_temp: tqtemp2,
          m_today_img1: res.data.imgurl1,
          m_today_img2: res.data.imgurl2,
          m_nextday_img1: res.data.imgurl21,
          m_nextday_img2: res.data.imgurl22
        })
      },
      fail: function(res) {
        that.setData({ tqtemp: 'π_π'});
      },
      complete: function(res) {},
    });
    //获取开学和放假日期，计算当前周
    wx.request({
      url: 'https://test.1zdz.cn/kcb/getdate.php',
      success: function (dat) {
        console.log(dat);
        itemFirstDay = dat.data.itemStart;
        //当前学期设置
        that.setData({
          arrayxq: [dat.data.nowItem],
        });
        //当前周次设置
        if (dat.data.specialDay == null) var nowtime = new Date();  //当前时间 用于平时
        else var nowtime = new Date(dat.data.specialDay);   //假期时，设置默认周次
        var nowtimestamp = Date.parse(nowtime);  //当前时间的时间戳（毫秒）最后三位000
        var day = ((nowtimestamp / 1000 - dat.data.itemStart) / 86400); //与开学时间的时间差（天）
        var nowzc = Math.ceil(day / 7); //向上取整
        if (nowzc > 20) nowzc = 20;
        that.setData({
          indexzc: nowzc-1,
        });
        //计算当前选择周1至周5日期
        that.caculateDate();
        //fix first time not current week BUG
        //NOWzc = nowzc - 1;
        //给其他页面共享当前周次
        wx.setStorage({
          key: 'nowzc',
          data: nowzc,
        })
      },
      fail: function (res) {
        
      },
    });
    wx.getStorage({
      key: 'server', success: function (res) {
        var server = that.data.server;
        if (res.data == null) {
          server = "210.30.62.37";
          wx.setStorage({
            key: 'server',
            data: "210.30.62.37",
          });
        } else {
          server = res.data;
        }
        that.setData({ server: server });
      },
      fail: function () {
        var server = that.data.server;
        server = "210.30.62.37";
        wx.setStorage({
          key: 'server',
          data: "210.30.62.37",
        });
        that.setData({ server: server });
        return;
      }
    });
  },
  onReady:function(){
    var that = this;
    //fix first time not current week BUG: delay 1s for data update
    setTimeout(function () {
      console.log("延迟调用============");
      var weeks = that.data.arrayzc[that.data.indexzc];
      console.log("onReady weeks:" + weeks);
      that.reFreshKCB();
    }, 1000)
    
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //计算当前选择周1至周5日期
    that.caculateDate();
    that.reFreshKCB();
  },
  //计算日期
  caculateDate: function () {
    var that = this;
    //计算当前选择周1至周5日期
    var selzc = that.data.arrayzc[that.data.indexzc];
    var everyMonday = (selzc - 1) * 7; //周次x7,获取没周一距离开学那天的天数
    var itemF = new Date(itemFirstDay * 1000);
    var YearY = itemF.getFullYear();
    var MonthM = itemF.getMonth() + 1 < 10 ? '0' + (itemF.getMonth() + 1) : itemF.getMonth() + 1;
    var DayD = itemF.getDate();
    var firstDayTime = new Date(YearY + "/" + MonthM + "/" + DayD + " 00:00:00");  //IOS系统的坑，用‘-’会加载不出来，只能用‘/’
    var firstDayTime = firstDayTime.valueOf();
    var addtoarrayth = that.data.arrayth;
    for (var i = 0; i < 7; i++) {
      var nextDate = new Date(firstDayTime + (everyMonday + i) * 24 * 60 * 60 * 1000); //后一天
      var nextMonth = nextDate.getMonth() + 1 < 10 ? '0' + (nextDate.getMonth() + 1) : nextDate.getMonth() + 1;
      var nextDay = nextDate.getDate() < 10 ? '0' + nextDate.getDate() : nextDate.getDate();
      addtoarrayth[i].date = nextMonth + "." + nextDay;
    }
    that.setData({
      arrayth: addtoarrayth,
    });
  },
  //课程表刷新
  reFreshKCB:function(){
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //刷新本地账号
    wx.getStorage({
      key: 'userid', success: function (res) {
        that.setData({ userid: res.data });
      },
    });
    wx.getStorage({
      key: 'userpwd', success: function (res) {
        that.setData({ userpwd: res.data });
      },
    });
    //计算当前选择周1至周5日期
    that.caculateDate();
    var Id = that.data.userid;
    var Pwd = encodeURIComponent(that.data.userpwd); //转义，防止有特殊字符如：&
    console.log('pwd:'+Pwd);
    if (Id == '' && Pwd == '') {
      wx.showModal({
        content: '缓存里没有你的学号和密码，请点击:“设置”>“学号和密码”',
        showCancel: true, 
        confirmText: "立即前往",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            //停止刷新
            wx.stopPullDownRefresh();
            // 隐藏顶部刷新图标
            wx.hideNavigationBarLoading();
            wx.navigateTo({
              url: '../setting-detail/set-userinfo',
            })
          }
        }
      });
      return;
      }
    var Server = that.data.server;
    if (Id == null) {
      return;
    }
    //模式判断
    var kcbaction = wx.getStorageSync('kcbaction');
    var action = '';
    if(kcbaction == 'static'){
      action = kcbaction;
      //显示等待提示
      wx.showToast({
        title: '玩命加载中...',
        icon: 'loading',
        duration: 1200
      });
    } else {
      action = 'dym';
      //显示等待提示
      wx.showToast({
        title: '正在从教务处抓取',
        icon: 'loading',
        duration: 1200
      });
    }
    console.log('action：'+action);

    //开始请求
    var WannaKey = app.encryptUserKey(Id, Pwd);
    var items = that.data.arrayxq[0];
    var weeks = that.data.arrayzc[that.data.indexzc];
    console.log("WabbaKey:" + WannaKey);
    console.log("item:" + items + "weeks" + weeks);
    wx.request({
      url: 'https://test.1zdz.cn/api/kcb.php',
      //url: 'http://leave.test/getkcb',
      method: 'POST',
      data: {
        XiangGanMa: WannaKey,
        item: items,
        week: weeks,
        server: Server,
        action: action
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res);
        if (res.data.state == "error") {
          wx.showModal({
            content: '学号或者密码错误，登陆教务处失败！或更换教务处服务器试试。',
            showCancel: true,
            confirmText: "前往修改",
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                wx.navigateTo({
                  url: '../setting-detail/set-userinfo',
                })
              }
            }
          });
        }
        else {
          var tdcolors = [
            'rgba(72,61,139,0.6)', 'rgba(100,149,237,0.8)', 'rgba(0,139,139,0.6)',
            'rgba(216,191,216,0.9)', 'rgba(106,96,205,0.5)', 'rgba(240,128,128,0.6)',
            'rgba(210,180,140,0.7)', 'rgba(144,238,144,0.9)', 'rgba(255,165,0,0.4)',
            'rgba(0,206,209,0.5)', 
            'rgb(204,154,168)', 'rgb(231,202,202)', 'rgb(126,171,117)','rgb(127,156,172)',
            'rgb(0,107,86)', 'rgb(125,147,186)', 'rgb(64,75,115)'
          ];
          //对同一科目进行标号
          var index = 1;
          for (var hang = 0; hang < 6; hang++) {
            for (var i = 0; i < 7; i++) {
              if (res.data[hang][i].name != "" && res.data[hang][i].index == "") {
                var tmp_name = res.data[hang][i].name;
                for (var h = hang; h < 6; h++) {//向下搜寻相同课程，名称
                  for (var j = 0; j < 7; j++) {
                    if (res.data[h][j].name == tmp_name && res.data[h][j].index == "") {
                      res.data[h][j].index = index;//标号
                    }
                  }
                }
                index++;
              }
            }
          }
          // { name: "", room: "", leader: "", time: "", color: "" }
          console.log("添加的颜色：");
          console.log(res.data);
          var ontime = ["08:00~08:45", "08:55~09:40", "10:05~10:50", "11:00~11:45", "13:20~14:05", "14:10~14:55", "15:15~16:00", "16:05~16:50", "18:00~18:45","18:55~19:40"];
          var changeKCB = new Array();
          for (var hang = 0; hang < 5; hang++) {
            changeKCB[hang] = new Array();
            var time1 = ontime[hang*2];
            var time2 = ontime[hang*2+1];
            for (var i = 0; i < 7; i++) {
              changeKCB[hang][i] = new Object();
              changeKCB[hang][i].kid = res.data[hang][i].kid;
              changeKCB[hang][i].name = that.isOver15(res.data[hang][i].name);
              changeKCB[hang][i].room = res.data[hang][i].room;
              changeKCB[hang][i].leader = res.data[hang][i].leader;
              changeKCB[hang][i].color = tdcolors[(res.data[hang][i].index - 1)%tdcolors.length];
              changeKCB[hang][i].time1 = time1;
              changeKCB[hang][i].time2 = time2;
            }
            //console.log(changeKCB);
            that.setData({ arraykcb: changeKCB, });
          }
        }
      },
      fail: function (res) {
        console.log("获取课程表失败！");
        wx.showModal({
          title: '课程表获取失败了！',
          content: '请检查：当前学号(' + Id + ')' + '、服务器(' + Server + ')，可先检查学号或者密码是否有误，然后再试着切换服务器试试。',
          confirmText: "切换服务器",
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../setting-detail/set-server',
              })
            } else {
              console.log('用户想了想')
            }
          }
        });
        //停止刷新
        wx.stopPullDownRefresh();
        // 隐藏顶部刷新图标
        wx.hideNavigationBarLoading();
      },
      complete: function (res) {
        //停止刷新
        wx.stopPullDownRefresh();
        // 隐藏顶部刷新图标
        wx.hideNavigationBarLoading();
      }
    });
    

    //停止刷新
    wx.stopPullDownRefresh();
    // 隐藏顶部刷新图标
    wx.hideNavigationBarLoading();
  },
  onShow:function(){
    var that = this;
    //刷新本地账号
    wx.getStorage({
      key: 'userid', success: function (res) {
        that.setData({ userid: res.data });
      },
    });
    wx.getStorage({
      key: 'userpwd', success: function (res) {
        that.setData({ userpwd: res.data });
      },
    });
  },
  //判断课程字数是否超出小方块
  isOver15:function(str) {
  if (str.length > 15) {
    return str.substring(0, 14) + "...";
  }
    else return str;
  },
  showdetail:function(e){
     console.log(e);
    var that = this;
    var gname = e.currentTarget.dataset.name;
    var groom = e.currentTarget.dataset.room;
    var gleader = e.currentTarget.dataset.leader;
    var gtime1 = e.currentTarget.dataset.time1;
    var gtime2 = e.currentTarget.dataset.time2;
    if (gname == ""){
      
    }else{
      that.setData({
        hiddenmodalput: false,
        name:gname,
        room:groom,
        leader:gleader,
        time1: gtime1,
        time2: gtime2,
      })
    }
  },
  //是否隐藏课程详细
  confirm: function () {
    this.setData({
      hiddenmodalput: true,
      hiddenaddkcb: true,
      hiddeneditkcb: true
    })
  },
  //显示自定义课程弹窗
  showAddOrEditKCB:function(e){
    var that = this;
    let hang = e.currentTarget.dataset.hang;
    let week = e.currentTarget.dataset.week;
    let kid = e.currentTarget.dataset.kid;
    let zc = that.data.indexzc;
    if (e.currentTarget.dataset.name == ""){ //无课程数据，显示添加课程
      that.setData({ hiddenaddkcb: false});
      that.setData({
        indexzcAdd1: zc,
        indexzcAdd2: zc,
        indexjcAdd1: hang,
        indexjcAdd2: hang,
        indexweekAdd: week
      });
    }else{                                   //有课程，显示编辑课程
      let name = e.currentTarget.dataset.name;
      let room = e.currentTarget.dataset.room;
      let leader = e.currentTarget.dataset.leader;
      that.setData({ 
        editkcbkid: kid,
        editkcbname: name,
        editkcbroom: room,
        editkcbleader: leader,
        hiddeneditkcb: false 
      });
    }
  },
  //添加课程
  addconfirm:function(e){
    var that = this;
    // console.log("添加课程啦");
    // console.log(e);
    let sno = wx.getStorageSync("userid");
    let name = e.detail.value.name;
    let room = e.detail.value.room;
    let teacher = e.detail.value.teacher;
    let week = that.data.indexweekAdd;
    let zc1 = parseInt(that.data.indexzcAdd1)+1;
    let zc2 = parseInt(that.data.indexzcAdd2)+1;
    let jc1 = parseInt(that.data.indexjcAdd1);
    let jc2 = parseInt(that.data.indexjcAdd2);
    // console.log("week:" + week + ",zc1:" +zc1+ ",zc2:" +zc2+ ",jc1:" +jc1+ ",jc2:"+jc2);
    //显示等待提示
    wx.showToast({
      title: '给我10秒钟...',
      icon: 'loading',
      duration: 10000
    }); 
    that.setData({hiddenaddkcb: true});//关闭窗口
    wx.request({
      url: 'https://test.1zdz.cn/api/addkcb.php',
      method: 'POST',
      data: {
        userid: sno,
        name: name,
        room:room,
        teacher:teacher,
        week:week,
        zc1:zc1,
        zc2:zc2,
        jc1:jc1,
        jc2:jc2
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log("添加课程返回结果：");
        console.log(res);
        if(res.data.code == 100){
          console.log("完美！")
        }
      },
      fail: function (res) {},
      complete: function (res) {
        that.reFreshKCB();
      }
    });
    
  },
  //修改课程
  editconfirm: function(e){
    var that = this;
    // console.log("修改课程啦");
    // console.log(e);
    let sno = wx.getStorageSync("userid");
    let kid = e.detail.value.kid;
    let name = e.detail.value.name;
    let room = e.detail.value.room;
    let teacher = e.detail.value.teacher;
    //显示等待提示
    wx.showToast({
      title: '修改中...',
      icon: 'loading',
      duration: 2000
    });
    that.setData({ hiddeneditkcb: true });//关闭窗口
    wx.request({
      url: 'https://test.1zdz.cn/api/editkcb.php',
      method: 'POST',
      data: {
        userid: sno,
        kid: kid,
        name: name,
        room: room,
        teacher: teacher
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == 100) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          });
        }
      },
      fail: function (res) { },
      complete: function (res) {
        that.reFreshKCB();
      }
    });
  },
  //删除课程
  delconfirm: function () {
    var that = this;
    // console.log("删除课程啦");
    // console.log(e);
    let sno = wx.getStorageSync("userid");
    let kid = that.data.editkcbkid;
    //显示等待提示
    wx.showToast({
      title: '删除中...',
      icon: 'loading',
      duration: 2000
    });
    that.setData({ hiddeneditkcb: true });//关闭窗口
    wx.request({
      url: 'https://test.1zdz.cn/api/delkcb.php',
      method: 'POST',
      data: {
        userid: sno,
        kid: kid
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.code == 100) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          });
        }
      },
      fail: function (res) { },
      complete: function (res) {
        that.reFreshKCB();
      }
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
　　var shareObj = {
      title: "工大教务处-课程表",
      path: '/pages/kcb/kcb',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          //可以在这里写
        }
      },
      fail: function () {
        if (res.errMsg == 'shareAppMessage:fail cancel') { }
        else if (res.errMsg == 'shareAppMessage:fail') { }
      },
      complete: function () {
        wx.setClipboardData({
          data: '小伙伴们，快来试手气赢 Apple 美国总部免费游！poRhYz38ct 你去美国我来买单！#吱口令#长按复制此消息，打开支付宝就能领取！',
          success: function (res) {
            wx.showModal({
              title: '提示',
              content: '推荐成功，恭喜获得App store 5元红包，马上打开支付宝即可领取！更有机会赢得Apple美国总部免费游。',
              confirmText: "知道啦",
              showCancel: false,
              success: function (res) {
                console.log(res);
                if (res.confirm) {
                  console.log('用户点击主操作');
                } else {
                  console.log('用户点击辅助操作')
                }
              }
            });
          }
        })
      }
  　};
  　　// 返回shareObj
  　return shareObj;
  },
  //colorUI
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  //minUI
  showPopup() {
    let popupComponent = this.selectComponent('.J_Popup');
    popupComponent && popupComponent.show();
  },
  hidePopup() {
    let popupComponent = this.selectComponent('.J_Popup');
    popupComponent && popupComponent.hide();
  }
})