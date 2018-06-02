(function() {
  const colorMap = [
    "#fff",
    "#27BBEE",
    "#88B14B",
    "#F5A623",
    "#FF7A7A"
  ];

  let cities=[{id:"新北",lv:0,},{id:"台北",lv:0,},{id:"基隆",lv:0,},{id:"桃園",lv:0,},{id:"新竹",lv:0,},{id:"苗栗",lv:0,},{id:"台中",lv:0,},{id:"彰化",lv:0,},{id:"雲林",lv:0,},{id:"嘉義",lv:0,},{id:"南投",lv:0,},{id:"台南",lv:0,},{id:"高雄",lv:0,},{id:"屏東",lv:0,},{id:"台東",lv:0,},{id:"花蓮",lv:0,},{id:"宜蘭",lv:0,},{id:"馬祖",lv:0,},{id:"金門",lv:0,},{id:"澎湖",lv:0,}];

  const contextMenu = $("#contextMenu");
  let currentId = '';
  let total = 0;

  // city name text
  $("text.city")
    .css('cursor', 'pointer')
    .click(bindContextMenu);

  // city area
  cities.map(city => {
    const dom = $("svg").find(`[id^='${city.id}']`);
    $(dom)
      .css('fill', 'white')
      .css('cursor', 'pointer')
      .click(bindContextMenu);
  });

  // hide context menu
  $(document).mouseup(e => {
    if (!contextMenu.is(e.target) && contextMenu.has(e.target).length === 0) {
      contextMenu.hide();
    }
  });

  // set level
  $("div[id^='lv']").click((e) => {
    const lv = parseInt(e.currentTarget.id.replace('lv', ''), 10);
    cities = cities.map(city => {
      if (city.id === currentId) {
        return {
          ...city,
          lv,
        };
      }
      return city;
    });
    contextMenu.hide();
    changeCityColor(lv);
    calcTotal();
  });

  // save as png
  $("#saveAs").click(() => {
    var svgString = new XMLSerializer().serializeToString(document.querySelector('#map'));
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext("2d");
    canvas.width = 750;
    canvas.height = 1124;
    canvg(canvas, svgString);
    canvas.toBlob(blob => saveAs(blob, 'taiwan.png'));
  });

  function bindContextMenu (e) {
    // 180: context menu width, 20: buffer
    // 165: context menu height, 30: buffer
    const widthOffset = window.innerWidth - e.pageX - 180 - 20;
    const heightOffset = window.innerHeight - e.pageY - 165 - 30;
    const x = widthOffset > 0 ? e.pageX : e.pageX + widthOffset;
    const y = heightOffset > 0 ? e.pageY : e.pageY + heightOffset;
    contextMenu
      .css('left', x)
      .css('top', y)
      .show();
    currentId = (e.target.id || e.target.textContent).replace(/\d*/g, '');
  }

  function calcTotal () {
    total = 0;
    cities.map(city => {
      total += city.lv;
    });
    $('#total').text(total);
  }

  function changeCityColor (lv) {
    const dom = $("svg").find(`[id^='${currentId}']`);
    dom.css('fill', colorMap[lv]);
  }
})();
