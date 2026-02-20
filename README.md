# Cubist

自作のJavaScriptライブラリです。
3x3ルービックキューブのSVG、およびその回転のアニメーションを作ることができます。

参考：[./example/index.html](https://kat0yu.github.io/cubist/example/)

# 始め方
## cube(SVG)を作る
まずこれをします。
特定のelement内にSVGを作ります。
初期設定として、**全面黒のキューブ**ができあがります。

`.fullColors()`などのメンバーを使うことで色を付けたりアニメーションを作ったりできます。

body
``` html
<div id="cube1"></div>
<p>Move: <span id="move1">[R, U]</span></p>
```

head
```html
<head>
  <script type="module">
    import Cubist from "https://cdn.jsdelivr.net/gh/kat0yu/cubist/src/index.js";

    const cube1 = new Cubist(document.getElementById("cube1"));
    cube1.fullColors();

    const move1Span = document.getElementById("#move1");
    const move1 = move1Span.textContent;
    const animate1_1 = cube1.getAnimateByMove(move1);
    move1Span.addEventListner("click", animate1_1);
  </script>
</head>
```

-> body
``` html
<div id="cube1"><svg>~~~</svg></div>
<p>Move: <span id="move1" onclick=animate1_1>[R, U]</span></p>
```