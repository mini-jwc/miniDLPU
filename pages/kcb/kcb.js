//index.js
//获取应用实例
const app = getApp();
var itemFirstDay;
let rewardedVideoAd = null;
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
    arrayjc: ["1,2","3,4","5,6","7,8","9,10","11,12"],
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

    //主题设置
    theme: {},
    trans: 0.75,

    // 新用户引导是否显示
    newuserguideisshow: false
    
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
    // 用户账号初始化
    let userid = wx.getStorageSync("userid");
    let userpwd = wx.getStorageSync("userpwd");
    //透明度获取
    let themeTransparency = wx.getStorageSync("ThemeTransparency") || 26;
    //主题更新
    that.setData({
      theme: app.getTheme(),
      trans: ((101 - themeTransparency) / 100).toFixed(2),
      userid: userid,
      userpwd: userpwd
    });
    var isshownotice1364 = wx.getStorageSync('isshownotice1364');
    if (isshownotice1364 != 1) {
      wx.showModal({
        content: '（1）更新成绩可查询学期；（2）修复部分同学无法查看考试日程问题；',
        showCancel: false,
        title: "更新通知",
        confirmText: "我知道了",
        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
        // cancelText: "下次通知",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.setStorageSync('isshownotice1364', 1);
            // wx.navigateTo({
            //   url: '../setting-detail/set-userinfo',
            // })
            //停止刷新
            wx.stopPullDownRefresh();
            // 隐藏顶部刷新图标
            wx.hideNavigationBarLoading();
          }
        }
      });
    }
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

    //视频广告
    if (wx.createRewardedVideoAd) {
      rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-cfdf2f4bd499a89d' })
      rewardedVideoAd.onLoad(() => {
        console.log('激励视频 广告加载成功')
      })
      rewardedVideoAd.onError((err) => {
        console.log('onError event emit', err)
      })
      rewardedVideoAd.onClose((res) => {
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          wx.setStorageSync("theEverydayCount", parseInt(wx.getStorageSync("theEverydayCount")) + app.globalData.countIncreseByAD);
          that.reFreshKCB();
        } else {
          // 播放中途退出，不下发游戏奖励
        }
      })
    }

  },//end onLoad
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
    //先清空课程表 为显示出刷新的效果
    that.setData({
      arraykcb : []
    });
    // wx.setStorageSync("theEverydayCount", 0);
    //次数消费判断
    if ('dym' == wx.getStorageSync('kcbaction')) {
      if (!app.delCount()){
        wx.showModal({
          content: '您当前查询次数剩余量为0，请等待' + app.globalData.countIncreseFre+'秒 后再试！服务器资源有限，请理解。您可在设置中查询今日总额度以及剩余额度，还可以赚取额外次数！完整观看广告，可立即+' + app.globalData.countIncreseByAD +'次！',
          showCancel: true,
          title: "查询次数已耗尽",
          confirmText: "观看广告",
          confirmColor: this.data.theme.color[this.data.theme.themeColorId].value,
          success: function (res) {
            if (res.confirm) {
              console.log('打开激励视频');
              // 在合适的位置打开广告
              if (rewardedVideoAd) {
                rewardedVideoAd.show()
                  .then(() => console.log('激励视频 广告显示'))
                  .catch(() => {
                    rewardedVideoAd.load()
                      .then(() => rewardedVideoAd.show())
                      .catch(err => {
                        console.log('激励视频 广告显示失败')
                      })
                  })
              }
            }
          }
        });
        return;
      }
    }
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
        title: "首次使用提示",
        content: '您还未绑定你的学号和密码，请点击:“设置”>“学号和密码”',
        showCancel: true, 
        confirmText: "立即前往",
        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
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
      console.log('action：' + action);
      //显示等待提示
      wx.showToast({
        title: '玩命加载中...',
        icon: 'loading',
        duration: 500
      });
      // 从本地获取课程表数据
      wx.getStorage({
        key: 'localDataKcb',
        success: function(res) {
          console.log(res);
          if (res.data.code != 100) {
            wx.showModal({
              content: '本地课程表数据包有错，请在“设置-学号和密码”里重新抓取课表',
              showCancel: true,
              confirmText: "立即前往",
              confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../setting-detail/set-userinfo',
                  })
                }
              }
            });
          }
          else {
            let weeks = that.data.arrayzc[that.data.indexzc];
            if(weeks<=18)that.beautifyAndResetKcb(res.data.data[weeks-1]); //v1.5.0 对课程表进行上色并更新显示数据
            else that.setData({arraykcb: []}); //对19,20周 空课屏蔽
          }
        },
        fail: function (res) {
          console.log("获取课程表失败！"); 
          wx.showModal({
            title: '提示',
            content: '本地没有课程表数据，请先抓取课程表，或者打开实时课表查询。点击立即前往抓取？',
            showCancel: true,
            confirmText: "立即前往",
            confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../setting-detail/set-userinfo',
                })
              }
            }
          });
          //停止刷新
          wx.stopPullDownRefresh();
          // 隐藏顶部刷新图标
          wx.hideNavigationBarLoading();
        }
      })

      
    } else {
      action = 'dym';
      console.log('action：' + action);
      //显示等待提示
      wx.showToast({
        title: '正在从教务处抓取',
        icon: 'loading',
        duration: 1200
      });
      //开始请求
      var WannaKey = app.encryptUserKey(Id, Pwd);
      var items = that.data.arrayxq[0];
      var weeks = that.data.arrayzc[that.data.indexzc];
      console.log("WabbaKey:" + WannaKey);
      console.log("item:" + items + "weeks" + weeks);
      // if(action == "dym") var reurl = wx.getStorageSync('myserver');
      // else var reurl = 'https://test.1zdz.cn';
      var reurl = wx.getStorageSync('myserver');
      console.log("当前请求服务器：" + reurl);
      wx.request({
        url: reurl + '/api/kcb.php',
        //url: 'http://leave.test/getkcb',
        method: 'POST',
        data: {
          XiangGanMa: WannaKey,
          item: items,
          week: weeks,
          // server: Server,
          // action: action
        },
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        success: function (res) {
          console.log(res);
          if (res.data.state == "error") {
            wx.showModal({
              content: '登陆教务处失败！可能当前服务器暂时被ban了，更换一台试试？也可能是学号或者密码错了喔',
              showCancel: true,
              confirmText: "前往切换",
              confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  wx.navigateTo({
                    url: '../setting-detail/set-server',
                  })
                }
              }
            });
          }
          else if (res.data.length == 6) {
            that.beautifyAndResetKcb(res.data); //v1.5.0 对课程表进行上色并更新显示数据
          }
        },
        fail: function (res) {
          console.log("获取课程表失败！");
          wx.showModal({
            title: '课程表获取失败了！',
            content: '请检查：当前学号(' + Id + ')' + '、服务器(' + Server + ')，可先检查学号或者密码是否有误，然后再试着切换服务器试试。',
            confirmText: "换服务器",
            confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
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
    } //end of dym modal
    //停止刷新
    wx.stopPullDownRefresh();
    // 隐藏顶部刷新图标
    wx.hideNavigationBarLoading();
  },
  onShow:function(){
    var that = this;
    //刷新本地账号
    let userid = wx.getStorageSync("userid");
    let userpwd = wx.getStorageSync("userpwd");
    //透明度获取
    let themeTransparency = wx.getStorageSync("ThemeTransparency") || 26;
    //主题更新
    that.setData({
      theme: app.getTheme(),
      trans: ((101 - themeTransparency) / 100).toFixed(2),
      userid: userid,
      userpwd: userpwd
    });
    //新用户引导
    let guideindex = wx.getStorageSync("newuserguideindex");
    console.log("guideindex:" + guideindex);
    if (userid && !guideindex){
      that.forNewUserNotice();
    }
    //检查本地是否有课程表数据localDataKcb
    let localDataKcb = wx.getStorageSync("localDataKcb");
    // v1.5.0 本地无课程表显示通知
    if (userid && !localDataKcb){
      // 更新通知
      // that.updateNews();
    }
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
    // 实时课表不允许编辑
    let isStatic = wx.getStorageSync('kcbaction');
    if(isStatic == 'dym'){
      wx.showModal({
        title: '提示',
        content: '使用实时课表时，无法编辑课表',
        showCancel: false,
        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
      })
      return;
    }
    if (that.data.indexzc > 17) {
      wx.showModal({
        title: '提示',
        content: '19,20周暂不支持编辑，如需需求，可以联系开发者',
        showCancel: false,
        confirmColor: that.data.theme.color[that.data.theme.themeColorId].value
      })
      return;
    }
    let hang = e.currentTarget.dataset.hang;
    let week = e.currentTarget.dataset.week;
    let kid = e.currentTarget.dataset.kid;
    let zc = that.data.indexzc;
    if (e.currentTarget.dataset.name == ""){ //无课程数据，显示添加课程
      that.setData({
        indexzcAdd1: zc,
        indexzcAdd2: zc,
        indexjcAdd1: hang,
        indexjcAdd2: hang,
        indexweekAdd: week,
        hiddenaddkcb: false
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
        editkcbzc: zc,      //v1.5.0 本地数据索引需要
        editkcbjc: hang,    //v1.5.0 本地数据索引需要
        editkcbweek: week,  //v1.5.0 本地数据索引需要
        hiddeneditkcb: false 
      });
    }
  },
  //添加课程
  addconfirm:function(e){
    var that = this;
    // console.log("添加课程啦");
    // console.log(e);
    let name = e.detail.value.name;
    let room = e.detail.value.room;
    let teacher = e.detail.value.teacher;
    let week = that.data.indexweekAdd;
    let zc1 = parseInt(that.data.indexzcAdd1);
    let zc2 = parseInt(that.data.indexzcAdd2);
    let jc1 = parseInt(that.data.indexjcAdd1);
    let jc2 = parseInt(that.data.indexjcAdd2);
    // console.log("week:" + week + ",zc1:" +zc1+ ",zc2:" +zc2+ ",jc1:" +jc1+ ",jc2:"+jc2);
    //显示等待提示
    wx.showToast({
      title: '给我几秒钟...',
      icon: 'loading',
      duration: 1500
    }); 
    that.setData({hiddenaddkcb: true});//关闭窗口
    //获取本地课程表数据进行编辑
    wx.getStorage({
      key: 'localDataKcb',
      success: function(res) {
        let kcbdata = res.data;
        for(;zc1<=zc2;zc1++){
          for(;jc1<=jc2;jc1++){
            kcbdata.data[zc1][jc1][week].name = name;
            kcbdata.data[zc1][jc1][week].room = room;
            kcbdata.data[zc1][jc1][week].leader = teacher;
          }
        }
        //修改更新时间
        let date = new Date();
        kcbdata.time = date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" + date.getMonth() + 1 : date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        // 更新本地数据
        wx.setStorageSync('localDataKcb', kcbdata);
        wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 1000
        });
        // 更新显示数据
        that.reFreshKCB();
      },
    })
    // wx.request({
    //   url: 'https://test.1zdz.cn/api/addkcb.php',
    //   method: 'POST',
    //   data: {
    //     userid: sno,
    //     name: name,
    //     room:room,
    //     teacher:teacher,
    //     week:week,
    //     zc1:zc1,
    //     zc2:zc2,
    //     jc1:jc1,
    //     jc2:jc2
    //   },
    //   header: { "Content-Type": "application/x-www-form-urlencoded" },
    //   success: function (res) {
    //     console.log("添加课程返回结果：");
    //     console.log(res);
    //     if(res.data.code == 100){
    //       console.log("完美！")
    //     }
    //   },
    //   fail: function (res) {},
    //   complete: function (res) {
    //     that.reFreshKCB();
    //   }
    // });
    
  },
  //修改课程
  editconfirm: function(e){
    var that = this;
    // console.log("修改课程啦");
    // console.log(e);
    // let sno = wx.getStorageSync("userid");
    // let kid = e.detail.value.kid;
    let name = e.detail.value.name;
    let room = e.detail.value.room;
    let teacher = e.detail.value.teacher;
    let edzc = that.data.editkcbzc;
    let edjc = that.data.editkcbjc;
    let edweek = that.data.editkcbweek;
    //显示等待提示
    wx.showToast({
      title: '修改中...',
      icon: 'loading',
      duration: 1500
    });
    that.setData({ hiddeneditkcb: true });//关闭窗口
    //获取本地课程表数据进行编辑
    wx.getStorage({
      key: 'localDataKcb',
      success: function (res) {
        let kcbdata = res.data;
        kcbdata.data[edzc][edjc][edweek].name = name;
        kcbdata.data[edzc][edjc][edweek].room = room;
        kcbdata.data[edzc][edjc][edweek].leader = teacher;
        //修改更新时间
        let date = new Date();
        kcbdata.time = date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" + date.getMonth() + 1 : date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        // 更新本地数据
        wx.setStorageSync('localDataKcb', kcbdata);
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1000
        });
        // 更新显示数据
        that.reFreshKCB();
      },
    })
    // wx.request({
    //   url: 'https://test.1zdz.cn/api/editkcb.php',
    //   method: 'POST',
    //   data: {
    //     userid: sno,
    //     kid: kid,
    //     name: name,
    //     room: room,
    //     teacher: teacher
    //   },
    //   header: { "Content-Type": "application/x-www-form-urlencoded" },
    //   success: function (res) {
    //     if (res.data.code == 100) {
    //       wx.showToast({
    //         title: '修改成功',
    //         icon: 'success',
    //         duration: 2000
    //       });
    //     }
    //   },
    //   fail: function (res) { },
    //   complete: function (res) {
    //     that.reFreshKCB();
    //   }
    // });
  },
  //删除课程
  delconfirm: function () {
    var that = this;
    // console.log("删除课程啦");
    // console.log(e);
    // let sno = wx.getStorageSync("userid");
    // let kid = that.data.editkcbkid;
    let edzc = that.data.editkcbzc;
    let edjc = that.data.editkcbjc;
    let edweek = that.data.editkcbweek;
    //显示等待提示
    wx.showToast({
      title: '删除中...',
      icon: 'loading',
      duration: 1500
    });
    that.setData({ hiddeneditkcb: true });//关闭窗口
    //获取本地课程表数据进行编辑
    wx.getStorage({
      key: 'localDataKcb',
      success: function (res) {
        let kcbdata = res.data;
        kcbdata.data[edzc][edjc][edweek].name = "";
        kcbdata.data[edzc][edjc][edweek].room = "";
        kcbdata.data[edzc][edjc][edweek].leader = "";
        //修改更新时间
        let date = new Date();
        kcbdata.time = date.getFullYear() + "-" + (date.getMonth() < 9 ? "0" + date.getMonth() + 1 : date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        // 更新本地数据
        wx.setStorageSync('localDataKcb', kcbdata);
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 1000
        });
        // 更新显示数据
        that.reFreshKCB();
      },
    })
    // wx.request({
    //   url: 'https://test.1zdz.cn/api/delkcb.php',
    //   method: 'POST',
    //   data: {
    //     userid: sno,
    //     kid: kid
    //   },
    //   header: { "Content-Type": "application/x-www-form-urlencoded" },
    //   success: function (res) {
    //     if (res.data.code == 100) {
    //       wx.showToast({
    //         title: '删除成功',
    //         icon: 'success',
    //         duration: 2000
    //       });
    //     }
    //   },
    //   fail: function (res) { },
    //   complete: function (res) {
    //     that.reFreshKCB();
    //   }
    // });
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
              confirmColor: that.data.theme.color[that.data.theme.themeColorId].value,
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
  // v1.5.0 对课程表数据进行上色渲染
  beautifyAndResetKcb: function(data){
    let that = this;
    let trans = that.data.trans;  //透明度设置获取
    // 'rgba(72,61,139,0.6)', 'rgba(100,149,237,0.8)', 'rgba(0,139,139,0.6)',
    //   'rgba(216,191,216,0.9)', 'rgba(106,96,205,0.5)', 'rgba(240,128,128,0.6)',
    //   'rgba(210,180,140,0.7)', 'rgba(144,238,144,0.9)', 'rgba(255,165,0,0.4)',
    //   'rgba(0,206,209,0.5)', 
    var tdcolors = [
      'rgba(72,61,139,' + trans + ')', 'rgba(100,149,237,' + trans + ')', 'rgba(0,139,139,' + trans + ')',
      'rgba(216,191,216,' + trans + ')', 'rgba(106,96,205,' + trans + ')', 'rgba(240,128,128,' + trans + ')',
      'rgba(210,180,140,' + trans + ')', 'rgba(144,238,144,' + trans + ')', 'rgba(255,165,0,' + trans + ')',
      'rgba(0,206,209,' + trans + ')',
      'rgba(204,154,168,' + trans + ')', 'rgba(231,202,202,' + trans + ')', 'rgba(126,171,117,' + trans + ')', 'rgba(127,156,172,' + trans + ')',
      'rgba(0,107,86,' + trans + ')', 'rgba(125,147,186,' + trans + ')', 'rgba(64,75,115,' + trans + ')'
    ];
    //对同一科目进行标号
    let index = 1;
    for (let hang = 0; hang < 6; hang++) {
      for (let i = 0; i < 7; i++) {
        if (data[hang][i].name != "" && data[hang][i].index == "") {
          let tmp_name = data[hang][i].name;
          for (let h = hang; h < 6; h++) {//向下搜寻相同课程，名称
            for (let j = 0; j < 7; j++) {
              if (data[h][j].name == tmp_name && data[h][j].index == "") {
                data[h][j].index = index;//标号
              }
            }
          }
          index++;
        }
      }
    }
    // { name: "", room: "", leader: "", time: "", color: "" }
    // console.log("添加的颜色：");
    // console.log(data);
    var ontime = [
      "08:00~08:45", "08:55~09:40",
      "10:05~10:50", "11:00~11:45",
      "13:20~14:05", "14:10~14:55",
      "15:15~16:00", "16:05~16:50",
      "18:00~18:45", "18:55~19:40",
      "19:50~20:40", "20:50~21:40"];
    var changeKCB = new Array();
    for (var hang = 0; hang < 6; hang++) {
      changeKCB[hang] = new Array();
      var time1 = ontime[hang * 2];
      var time2 = ontime[hang * 2 + 1];
      for (var i = 0; i < 7; i++) {
        changeKCB[hang][i] = new Object();
        changeKCB[hang][i].kid = data[hang][i].kid;
        changeKCB[hang][i].name = that.isOver15(data[hang][i].name);
        changeKCB[hang][i].room = data[hang][i].room;
        changeKCB[hang][i].leader = data[hang][i].leader;
        changeKCB[hang][i].color = tdcolors[(data[hang][i].index - 1) % tdcolors.length];
        changeKCB[hang][i].time1 = time1;
        changeKCB[hang][i].time2 = time2;
      }
      //console.log(changeKCB);
      that.setData({ arraykcb: changeKCB, });
    }
  },
  //新用户引导
  forNewUserNotice: function () {
    let that = this;
    that.setData({
      newuserguideisshow: true,
      newuserguideindex: 0
    });
  },
  // 新用户引导 之下一步
  guideNext: function () {
    let that = this;
    let nowindex = that.data.newuserguideindex;
    if (nowindex < 5){
      that.setData({
        newuserguideindex: nowindex + 1
      });
    }else{
      that.setData({
        newuserguideisshow: false
      });
      wx.setStorageSync("newuserguideindex", nowindex);
    }
  },
  // 更新通知
  updateNews: function () {
    var isshownotice1363 = wx.getStorageSync('isshownotice1363');
    if (isshownotice1363 != 1) {
      wx.showModal({
        content: '（1）更新成绩查询学期；（2）修复部分同学无法查看考试日程问题；',
        showCancel: true,
        title: "重要通知",
        confirmText: "前往抓取",
        confirmColor: "#1298CF",
        cancelText: "下次通知",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.setStorageSync('isshownotice1363', 1);
            wx.navigateTo({
              url: '../setting-detail/set-userinfo',
            })
            //停止刷新
            wx.stopPullDownRefresh();
            // 隐藏顶部刷新图标
            wx.hideNavigationBarLoading();
          }
        }
      });
      wx.setStorageSync('isshownotice1363', 0);
    }
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