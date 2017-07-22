const conf = {
  data: {
    hasEmptyGrid: false
  },

  onLoad(options) {
    const date = new Date();
    const cur_year = date.getFullYear();
    const cur_month = date.getMonth() + 1;
    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];
    const today = date.getDate();
    const disabled = false; // 今天时候已经打过卡了

    this.calculateEmptyGrids(cur_year, cur_month);
    this.calculateDays(cur_year, cur_month);
    // 从后台获取激活的天
    this.getActiveDays('username', cur_year, cur_month);

    this.setData({
      cur_year,
      cur_month,
      weeks_ch, // 周
      today,
      disabled
    })
  },
  // 返回当前月有多少天
  getThisMonthDays(year, month) {
    return new Date(year, month, 0).getDate();
  },
  // 获取当前月的第一天是周几
  getFirstDayOfWeek(year, month) {
    return new Date(Date.UTC(year, month - 1, 1)).getDay();
  },
  // 根据年和月计算页面中的应该展示的网格的数量
  calculateEmptyGrids(year, month) {
    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
    let empytGrids = [];
    if (firstDayOfWeek > 0) {
      for (let i = 0; i < firstDayOfWeek; i++) {
        empytGrids.push(i);
      }
      this.setData({
        hasEmptyGrid: true,
        empytGrids
      });
    } else {
      this.setData({
        hasEmptyGrid: false,
        empytGrids: []
      });
    }
  },
  // 计算年的月的天数
  calculateDays(year, month) {
    let days = [];
    const thisMonthDays = this.getThisMonthDays(year, month);

    for (let i = 1; i <= thisMonthDays; i++) {
      days.push(i);
    }

    this.setData({
      days: days
    });
  },
  // 处理点击《》的事件函数
  handleCalendar(e) {
    const handle = e.currentTarget.dataset.handle;
    const cur_year = this.data.cur_year;
    const cur_month = this.data.cur_month;
    if (handle === 'prev') {
      let newMonth = cur_month - 1;
      let newYear = cur_year;
      if (newMonth < 1) {
        newYear = cur_year - 1;
        newMonth = 12;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })

    } else {
      let newMonth = cur_month + 1;
      let newYear = cur_year;
      if (newMonth > 12) {
        newYear = cur_year + 1;
        newMonth = 1;
      }

      this.calculateDays(newYear, newMonth);
      this.calculateEmptyGrids(newYear, newMonth);

      this.setData({
        cur_year: newYear,
        cur_month: newMonth
      })
    }
  },
  // 获取激活的天数
  getActiveDays(username, year, month) {
    const activeDays = [];
    var days = this.data.days;
    const length = (days !== null ? days[days.length - 1] : 0);

    for (let i = 0; i < length; i++) {
      activeDays[i] = false;
    }

    // 模拟请求返回的数据
    activeDays[2] = true;
    activeDays[4] = true;
    activeDays[6] = true;

    this.setData({
      activeDays
    });
  },
  // 点击按钮事件
  clickShowToast() {
    wx.showToast({
      title: '打卡成功！',
      icon: 'success',
      duration: 1000
    })

    this.setData({
      disabled: true
    });
  },

  onShareAppMessage() {
    return {
      title: '老婆来吃药啦',
      desc: '每日提醒吃药，可以查看历史记录',
      path: 'pages/index/index'
    }
  }
};

Page(conf);