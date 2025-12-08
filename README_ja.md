# twiq

[English](README.md) | Japanese

**twiq** は、モダンな Web 開発のための、極小・ビルド不要・型セーフな UI ライブラリです。仮想 DOM や複雑なビルドステップのオーバーヘッドなしに、標準的な HTML/SVG タグを使用して宣言的なインターフェースを構築できます。

## 特徴

- 🪶 **Tiny**: 最小限のフットプリント、依存関係ゼロ。
- ⚡ **Zero Build**: ブラウザで直接動作します（標準 ES モジュール）。
- 🛡️ **Type-Safe**: HTML および SVG タグに対する完全な TypeScript サポート。
- 📝 **Declarative**: UI を状態の純粋な関数として記述できます。
- 🧩 **No VDOM**: 最大限のパフォーマンスを得るための直接的な DOM 操作。

## インストール

```bash
npm install @twiqjs/twiq
```

または、HTML 内で CDN 経由で直接使用することもできます（ES モジュール）:

```html
<script type="module">
  import { tags, mount } from 'https://unpkg.com/@twiqjs/twiq/dist/twiq.js';
</script>
```

## 使い方

### 基本例

```ts
import { tags, mount } from '@twiqjs/twiq';

const { div, h1, button } = tags;

// 1. コンポーネントの定義
// コンポーネントは、要素を返す単なる関数です。
const App = (count) => 
  div({ id: 'app' },
    h1({}, `Count: ${count}`),
    button({ 
      onClick: () => update(count + 1) 
    }, 'Increment')
  );

// 2. 更新関数の定義
const update = (newCount) => {
  mount('app', App(newCount));
};

// 3. 初回マウント
// HTML側にコンテナが必要です: <div id="app"></div>
mount('app', App(0));
```

### 仕組み（How It Works）

`mount` は、ターゲット要素のコンテンツを更新するシンプルなヘルパーです。

1.  **ターゲットの解決**: ID によってターゲット要素を検索します（または Element を直接受け取ります）。
2.  **コンテンツの置換**: `replaceChildren` を使用して、ターゲットのコンテンツを新しい要素で置き換えます。

> [!NOTE]
> `twiq` は仮想 DOM (Virtual DOM) を使用しません。`mount` はターゲット要素の子要素を直接置き換えます。

### 関数型コンポーネント

コンポーネントは、要素を返す単なる関数です。

```ts
const { li, span } = tags;

const TodoItem = (task) => 
  li({ class: task.completed ? 'done' : '' },
    span({}, task.title)
  );

// リストでの使用
// 注意: 配列にはスプレッド構文 (...) を使用する必要があります。
const TaskList = (tasks) => 
  div({}, 
    ...tasks.map(TodoItem)
  );
```

### イベントハンドリング

`on` で始まるプロパティはイベントリスナーとして扱われます。

```ts
button({ onClick: (e) => console.log('Clicked!') }, 'Click Me')
```

### スタイリング

標準的な `class` 属性または `style` 文字列を使用します。

```ts
div({ class: 'container', style: 'color: red; padding: 10px;' }, 'Content')
```

## API リファレンス

### `tags` / `tagsSvg`

標準的な HTML および SVG 要素の関数を生成するプロキシです。

```ts
const { div, span } = tags;
const { svg, circle } = tagsSvg;

// 構文: tag(props?, ...children)
div({ id: 'foo' }, 'Hello');
```

- **props**: 属性のキーと値のオブジェクト。`on[Event]` キーはリスナーをアタッチします。値として渡された関数が実行されます。
- **children**: 文字列または Node。**配列は直接受け付けません**。スプレッド構文 (`...`) を使用してください。

### `mount(target, ...children)`

ターゲット要素のコンテンツを更新します。

- **target**: `string` (ID) または `Element`。
- **children**: `string` または `Node`。複数の引数を渡すことができます。
- **動作**: `replaceChildren` を使用してターゲットを更新します。配列はスプレッド (`...`) する必要があります。

## ライセンス

MIT
