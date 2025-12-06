# twiq

[English](README.md) | 日本語

**twiq** は、モダンな Web 開発のための、極小・ビルド不要・型セーフな UI ライブラリです。仮想 DOM や複雑なビルドステップのオーバーヘッドなしに、標準的な HTML/SVG タグを使用して宣言的なインターフェースを構築できます。

## 特徴

- 🪶 **Tiny**: 最小限のフットプリント、依存関係ゼロ。
- ⚡ **Zero Build**: ブラウザで直接動作します（標準 ES モジュール）。
- 🛡️ **Type-Safe**: HTML および SVG タグに対する完全な TypeScript サポート。
- 📝 **Declarative**: UI を状態の純粋な関数として記述できます。
- 🧩 **No VDOM**: 最大限のパフォーマンスを得るための直接的な DOM 操作。

## インストール

```bash
npm install twiq
```

または、HTML 内で CDN 経由で直接使用することもできます（ES モジュール）:

```html
<script type="module">
  import { tags, render } from 'https://unpkg.com/twiq/dist/twiq.js';
</script>
```

## 使い方

### 基本例

```ts
import { tags, render } from 'twiq';

const { div, h1, button } = tags;

// 1. レンダラーの定義
// 関数はデータを受け取り、要素構造を返します。
const renderApp = render((count) => 
  div({ id: 'app' },
    h1({}, `Count: ${count}`),
    button({ 
      onClick: () => update(count + 1) 
    }, 'Increment')
  )
);

// 2. 更新関数の定義
const update = (newCount) => {
  renderApp(newCount);
};

// 3. 初期レンダリングとマウント
document.body.append(renderApp(0));
```

### 仕組み（How It Works）

twiq は「安定したコンテナ（stable container）」アプローチを採用しています。`render(...)` によって作成された関数を呼び出すと:

1.  **初回呼び出し**: DOM 要素を作成し、ルート要素（またはフラグメント）を返します。これをドキュメントに追加します。
2.  **2回目以降の呼び出し**: 既存のルート要素の **中身（content）** を更新します。`replaceChildren` を使用してビューを効率的に更新します。

> [!NOTE]
> 初回の `render` 呼び出しで返される要素は安定しています（再生成されません）。これを一度だけ DOM に追加してください。その後の更新では、この要素自体ではなく、その子要素が変更されます。

### 関数型コンポーネント

コンポーネントは、要素を返す単なる関数です。

```ts
const { li, span } = tags;

const TodoItem = (task) => 
  li({ class: task.completed ? 'done' : '' },
    span({}, task.title)
  );

// リストでの使用
const renderList = render((tasks) => 
  div({}, 
    ...tasks.map(TodoItem)
  )
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
- **children**: 文字列、数値、Node、またはそれらの配列。

### `render(callback)`

ルート要素のための更新関数を作成します。

- **callback**: `(...args) => Element | DocumentFragment | Array<...>`
- **Returns**: `...args` を受け取る関数。この返された関数を呼び出すと DOM が更新されます。

## ライセンス

MIT
