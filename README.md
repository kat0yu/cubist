# Cubist

自作のJavaScriptライブラリです。
3x3ルービックキューブのSVG、およびその回転のアニメーションを作ることができます。

# 始め方
## cube(SVG)を作る
まずこれをします。
特定のelement内にSVGを作ります。
初期設定として、**全面黒のキューブ**ができあがります。

body
``` html
<div id="cube1"></div>
<p>Move: <span id="move1">[R, U]</span></p>
```

head
```html
<head>
  <script type="module">
    import {Cubist, Movist} from "../src/index.js";
    // Cubist.default.poly = [[4, 3], 3, Cubist.SLICEBYFACE]

    const cube1Div = document.queryselector("#cube1");
    const cube1 = new Cubist(cube1Div);
    cube1.colorAll();

    const move1Span = document.queryselector("#move1");
    const move1 = new Movist(move1Span.textContent);
    move1Span.textContent = move1.simplify();
    
    const animate1_1 = cube1.getAnimate(move1);
    move1Span.addEventListner("click", animate1_1);
  </script>
</head>
```

-> body
``` html
<div id="cube1"><svg>~~~</svg></div>
<p>Move: <span id="move1" onclick=animate1_1>R U R' U'</span></p>
```

# クラス図
```mermaid
classDiagram
  class **Interface**{
  }
  class Cubist{
    +fullColors()
    +addColors-By-Face|Sticker|Move()
    +removeColors-By|Except-Face|Sticker|Move()
    +moveColors()
    +setOpacity()
    +getAnimate()
  }
  class Sticker{
    +face
    +cell
    +_allSticker()_
  }
  class Face{
  }
  class Cell{
  }
  class Movist{
    +setMove()
    +getMove()
    +reverse(bool)
    +exponent(int)
    +flat(int=0)
    +simplify()
    +positivify()
    +revert()
  }
  class Movrackets{
  }
  class Movunit{
  }
  class Ibracket{
  }
  class Vbracket{
  }
  class Nbracket{
  }
  class Movase{
  }

  **Interface** ..> Cubist
  **Interface** ..> Movist

  Cubist ..> Sticker
  Cubist ..> Movist
  Movist ..> Movrackets
  
  Sticker ..> Face
  Sticker ..> Cell
  
  Sticker ..> Movunit
  
  Movrackets ..* Movunit
  Movrackets ..* Ibracket
  Movrackets ..* Vbracket
  Movrackets ..* Nbracket
  
  Movunit <|-- Movase
  Ibracket <|-- Movase
  Vbracket <|-- Movase
  Nbracket <|-- Movase
```