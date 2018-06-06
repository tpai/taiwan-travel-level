(function() {
  // object assign polyfill
  polyfill();

  var colorMap = [
    "#fff",
    "#27BBEE",
    "#88B14B",
    "#F5A623",
    "#FF7A7A"
  ];

  var cities=[{id:"新北",lv:0,},{id:"台北",lv:0,},{id:"基隆",lv:0,},{id:"桃園",lv:0,},{id:"新竹",lv:0,},{id:"苗栗",lv:0,},{id:"台中",lv:0,},{id:"彰化",lv:0,},{id:"雲林",lv:0,},{id:"嘉義",lv:0,},{id:"南投",lv:0,},{id:"台南",lv:0,},{id:"高雄",lv:0,},{id:"屏東",lv:0,},{id:"台東",lv:0,},{id:"花蓮",lv:0,},{id:"宜蘭",lv:0,},{id:"馬祖",lv:0,},{id:"金門",lv:0,},{id:"澎湖",lv:0,}];

  var contextMenu = document.querySelector("#contextMenu");
  var menuTitle = document.querySelector('#menuTitle');
  var currentId = '';
  var total = 0;

  // city name text
  var cityTexts = [].map.call(document.querySelectorAll('text.city'), function (ele) { return ele; });
  cityTexts.map(function (cityText) {
    cityText.style.cursor = 'pointer';
    cityText.addEventListener('click', bindContextMenu);
  });

  // city area
  cities.map(function (city) {
    var doms = [].map.call(document.querySelectorAll('[id^=' + city.id + ']'), function (ele) { return ele; });
    doms.map(function (dom) {
      dom.style.fill = '#fff';
      dom.style.cursor = 'pointer';
      dom.addEventListener('click', bindContextMenu);
    });
  });

  // hide context menu
  document.addEventListener('mouseup', closeWhenClickOutside);
  document.addEventListener('touchend', closeWhenClickOutside);

  function closeWhenClickOutside (e) {
    if (!contextMenu === e.target || !contextMenu.contains(e.target)) {
      contextMenu.style.display = 'none';
    }
  }

  // set level
  var levels = [].map.call(document.querySelectorAll("div[id^='lv']"), function (ele) { return ele; });
  levels.map(function (level) {
    level.addEventListener('click', function (e) {
      var lv = parseInt(e.currentTarget.id.replace('lv', ''), 10);
      cities = cities.map(function (city) {
        if (city.id === currentId) {
          return Object.assign({}, city, { lv: lv });
        }
        return city;
      });
      contextMenu.style.display = 'none';
      changeCityColor(lv);
      calcTotal();
    });
  });

  // save as png
  document.querySelector('#saveAs').addEventListener('click', function () {
    var svgString = new XMLSerializer().serializeToString(document.querySelector('#map'));
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.width = 750;
    canvas.height = 1124;
    canvg(canvas, svgString);
    canvas.toBlob(function (blob) { saveAs(blob, 'taiwan.png'); });
  });

  function bindContextMenu (e) {
    // 180: context menu width, 20: buffer
    // 165: context menu height, 30: buffer
    const widthOffset = window.innerWidth - e.pageX - 180 - 20;
    const heightOffset = window.innerHeight - e.pageY - 165 - 30;
    const x = widthOffset > 0 ? e.pageX : e.pageX + widthOffset;
    const y = heightOffset > 0 ? e.pageY : e.pageY + heightOffset;
    contextMenu.style.top = y + 'px';
    contextMenu.style.left= x + 'px';
    contextMenu.style.display = 'block';
    currentId = (e.target.id || e.target.textContent).replace(/\d*/g, '');
    menuTitle.textContent = currentId;
  }

  function calcTotal () {
    total = 0;
    cities.map(function (city) {
      total += city.lv;
    });
    document.querySelector('#total').textContent= total;
  }

  function changeCityColor (lv) {
    var doms = [].map.call(document.querySelectorAll('[id^=' + currentId + ']'), function (ele) { return ele; });
    doms.map(function (dom) {
      dom.style.fill = colorMap[lv];
    });
  }

  /**
   ** Object assign polyfill
   ** https://github.com/rubennorte/es6-object-assign
   **/

  function assign(target, firstSource) {
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert first argument to object');
    }

    var to = Object(target);
    for (var i = 1; i < arguments.length; i++) {
      var nextSource = arguments[i];
      if (nextSource === undefined || nextSource === null) {
        continue;
      }

      var keysArray = Object.keys(Object(nextSource));
      for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
        var nextKey = keysArray[nextIndex];
        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== undefined && desc.enumerable) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
    return to;
  }

  function polyfill() {
    if (!Object.assign) {
      Object.defineProperty(Object, 'assign', {
        enumerable: false,
        configurable: true,
        writable: true,
        value: assign
      });
    }
  }
})();
