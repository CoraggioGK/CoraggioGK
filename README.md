# 合同会社Coraggio コーポレートサイト

システム・業務コンサルティングを手がける合同会社CoraggioのLP型コーポレートサイト。
HTML / CSS / バニラJS の静的サイトで、GitHub Pages にそのまま公開できます。

## ファイル構成

```
CorporatePage/
├── index.html        … ページ本体（全セクション）
├── css/style.css     … スタイル（カラーパレットは :root にまとめて定義）
├── js/main.js        … メニュー開閉・スクロール演出・フォーム制御
├── 要件定義.md        … 要件定義書
└── README.md
```

## カラーパレット

`css/style.css` の `:root` で一括管理しています。

| 変数 | 値 | 用途 |
|------|-----|------|
| `--c-slate` | `#8aa2a9` | ベース／見出し |
| `--c-sage`  | `#90baad` | アクセント |
| `--c-green` | `#a1e5ab` | ライトグリーン |
| `--c-mint`  | `#adf6b1` | ミント（最も明るい） |

## ローカルで確認する

任意の静的サーバーで開けます。

```bash
python -m http.server 8080
# → http://localhost:8080
```

## GitHub Pages へ公開する

1. GitHubでリポジトリを作成し、このフォルダの中身をプッシュ
2. リポジトリの **Settings → Pages** を開く
3. **Source** を `Deploy from a branch`、Branchを `main` / `(root)` に設定して保存
4. 数分後 `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開

## お問い合わせフォームの設定（重要）

GitHub Pagesはサーバー処理ができないため、フォーム送信は外部サービスに委譲します。

1. [Formspree](https://formspree.io/) などで無料アカウントを作成し、フォームのエンドポイントURLを取得
2. `index.html` の `<form id="contactForm" action="">` の **action** にそのURLを設定

```html
<form class="form" id="contactForm" action="https://formspree.io/f/xxxxxxx" method="POST">
```

未設定のまま送信ボタンを押すと、画面に設定を促す案内が表示されます。

### 送信時の挙動（Ajax送信）

`js/main.js` で `fetch()` によるAjax送信を行うため、**ページ遷移せず** フォーム内にメッセージを表示します。

- 成功時：「お問い合わせを送信しました。」を緑で表示し、入力欄をクリア
- 失敗時：赤いエラーメッセージを表示
- 送信中：ボタンが「送信中…」になり二重送信を防止

### スパム対策（ハニーポット）

`_gotcha` という名前の隠しフィールド（人間には見えない）を設置しています。ボットが入力するとFormspree側で自動的にスパム判定され弾かれます。Formspree管理画面のCAPTCHAはオフのままで構いません。

> 補足：初回送信時のみ、登録メール宛にFormspreeから本人確認メールが届きます（1回承認すれば以降不要）。無料プランは月50件まで。

## 差し替えが必要なダミー箇所

`index.html` 内の以下を実データに置き換えてください。

- 会社概要テーブル（設立年・代表者・所在地・連絡先）
- サービス／強み／進め方の説明文（必要に応じて）
- OGP・構造化データ内の `url`
