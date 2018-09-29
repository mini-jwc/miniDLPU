// pages/cj/cj.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: "",
    userpwd: "",
    server: '210.30.62.37',
    cjnowxq:5,
    arrayxq: [
      '2015-2016-1', 
      '2015-2016-2', 
      '2016-2017-1', 
      '2016-2017-2', 
      '2017-2018-1',
      '2017-2018-2',
      '2018-2019-1', 
      '2018-2019-2'],
    hiddenmodalput: true,
    name:"",
    grade:"",
    pscjb:"",
    pscj:"",
    qmcjb:"",
    qmcj:"",
    credit: "",
    point: "",
    hour: "",
    method: "",
    kcsx: "",
    kcxz: "",
    arraycj: [
      { name: "", grade: "", pscjb: "", pscj: "", qmcjb: "", qmcj: "", credit: "", point: "", hour: "", method: "", kcsx: "", kcxz: "" },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var Id = that.data.userid;
    var Pwd = that.data.userpwd;
    //刷新本地账号
    wx.getStorage({
      key: 'userid', success: function (res) {
        Id = res.data;
        that.setData({ userid: Id });
      },
    });
    wx.getStorage({
      key: 'userpwd', success: function (res) {
        Pwd = res.data;
        that.setData({ userpwd: Pwd });
      },
    });
    //刷新服务器
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
    that.refreshCJ();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '工大教务处-成绩查询',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/more/cj/cj'
    };
  },
  bindPickerChange: function (e) {
    var that = this;
    that.setData({
      cjnowxq: e.detail.value
    });
    that.refreshCJ();
  },
  //成绩刷新
  refreshCJ:function(){
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    //显示等待提示
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 4500
    });
    var Id = that.data.userid;
    var Pwd = that.data.userpwd;
    //刷新本地账号
    wx.getStorage({
      key: 'userid', success: function (res) {
        Id = res.data;
        that.setData({ userid: Id });
        wx.getStorage({
          key: 'userpwd', success: function (res) {
            Pwd = res.data;
            that.setData({ userpwd: Pwd });
            wx.getStorage({
              key: 'server', success: function (res) {
                var Server = that.data.server;
                if (res.data == null) {
                  Server = "210.30.62.37";
                  wx.setStorage({
                    key: 'server',
                    data: "210.30.62.37",
                  });
                } else {
                  Server = res.data;
                }
                that.setData({ server: Server });
                that.requestCJ(Id,Pwd,Server);
              }
            });
          },
        });
      },
    });
    //停止刷新
    wx.stopPullDownRefresh();
    // 隐藏顶部刷新图标
    wx.hideNavigationBarLoading();
  },
  //成绩请求单独作为一个方法
  requestCJ:function(Id,Pwd,Server){
    var that = this;
    if (Id == '' && Pwd == '') {
      wx.showModal({
        content: '本地不存在教务处账号和密码，请点击:“设置”>“教务处信息更改”',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            //停止刷新
            wx.stopPullDownRefresh();
            // 隐藏顶部刷新图标
            wx.hideNavigationBarLoading();
          }
        }
      });
      return;
    }
    if (Id == null) {
      return;
    }
    var items = that.data.arrayxq[that.data.cjnowxq];
    console.log("item:" + items);
    wx.request({
      url: 'https://test.1zdz.cn/api/cj.php',
      method: 'POST',
      data: {
        id: Id,
        pwd: Pwd,
        item: items,
        server: Server
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        console.log(res.data);
        var changeCJ = [];
        if(res.data.state=="error"){
          wx.showModal({
            content: '学号或者密码错误，登陆教务处失败！或更换教务处服务器试试。',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定');
                return;
              }
            }
          });
        }else{
          for (var i = 0; i < res.data.length; i++) {
            changeCJ[i] = new Object();
            changeCJ[i].name = that.isOver16(res.data[i].name);
            changeCJ[i].grade = res.data[i].grade;
            changeCJ[i].pscjb = res.data[i].detail.pscjb;
            changeCJ[i].pscj = res.data[i].detail.pscj;
            changeCJ[i].qmcjb = res.data[i].detail.qmcjb;
            changeCJ[i].qmcj = res.data[i].detail.qmcj;
            changeCJ[i].credit = res.data[i].detail.credit;
            changeCJ[i].point = res.data[i].detail.point;
            changeCJ[i].hour = res.data[i].detail.hour;
            changeCJ[i].method = res.data[i].detail.method;
            changeCJ[i].kcsx = res.data[i].detail.kcsx;
            changeCJ[i].kcxz = res.data[i].detail.kcxz;
          }
        }
        //console.log(changeCJ);
        that.setData({ arraycj: changeCJ, });
      },
      fail: function (res) {
        console.log("获取成绩失败！");
        wx.showToast({
          title: '获取失败！',
          duration: 1000
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
  isOver16: function (str) {
    if (str.length > 16) {
      return str.substring(0, 15) + "...";
    }
    else return str;
  },
  isOver11: function (str) {
    if (str.length >11) {
      return str.substring(0, 10) + "...";
    }
    else return str;
  },
  showdetail: function (e) {
    console.log(e);
    var that = this;
    var noshow = false;
    var gname = that.isOver11(e.currentTarget.dataset.name);
    var ggrade = e.currentTarget.dataset.grade;
    var gpscjb = e.currentTarget.dataset.pscjb;
    var gpscj = e.currentTarget.dataset.pscj;
    var gqmcjb = e.currentTarget.dataset.qmcjb;
    var gqmcj = e.currentTarget.dataset.qmcj;
    var gcredit = e.currentTarget.dataset.credit;
    var gpoint = e.currentTarget.dataset.point;
    var ghour = e.currentTarget.dataset.hour;
    var gmethod = e.currentTarget.dataset.method;
    var gkcsx = e.currentTarget.dataset.kcsx;
    var gkcxz = e.currentTarget.dataset.kcxz;
    if (gname == "" || ggrade == "") noshow = true;
    that.setData({
      hiddenmodalput: noshow,
      name: gname,
      grade: ggrade,
      pscjb: gpscjb,
      pscj: gpscj,
      qmcjb: gqmcjb,
      qmcj: gqmcj,
      credit: gcredit,
      point: gpoint,
      hour: ghour,
      method: gmethod,
      kcsx: gkcsx,
      kcxz: gkcxz
    })
  },
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  }
})