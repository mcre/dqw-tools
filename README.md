# dqw-tools

DQW(ドラクエウォーク)のプレイに便利な情報を提供できるツール集。

https://dqw.mcre.info

## 開発時メモ

### 初期設定

```
npm create vuetify
Need to install the following packages:
  create-vuetify@1.0.8
Ok to proceed? (y) y

Vuetify.js - Material Component Framework for Vue

✔ Project name: … dqw-tools
✔ Which preset would you like to install? › Essentials (Vuetify, VueRouter, Pinia)
✔ Use TypeScript? … No / Yes
✔ Would you like to install dependencies with yarn, npm, or pnpm? › npm
```

.vscode/settings.json に追加

```
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### AWS 設定

#### S3 バケットの作成

- バケット名
  - dqw.mcre.info
- リージョン
  - ap-northeast-1
- タグ
  - project
    - dqw.mcre.info
- ほかデフォルト

#### CloudFront ディストリビューションの作成

Prerenderはmcre.infoと共有する。

- オリジンドメイン
  - dqw.mcre.info.s3.ap-northeast-1.amazonaws.com
- オリジンパス
  - 空白
- 名前
  - dqw.mcre.info
- オリジンアクセス
  - Origin access control settings
  - コントロール設定を作成
    - そのまま作成ボタンを押す
- カスタムヘッダー
  - なにもしない
- オリジンシールド
  - いいえ
- デフォルトのキャッシュビヘイビア(デフォルトからの変更点のみ記載)
  - ビューワープロトコルポリシー
    - Redirect HTTP to HTTPS
  - キャッシュキーとオリジンリクエスト
    - Legacy cache settings
      - ヘッダー
        - 次のヘッダーを含める
          - X-Prerender-Cachebuster
          - X-Prerender-Token
          - X-Prerender-Host
          - X-Query-String
      - クエリ文字列
        - なし
      - cookie
        - なし
      - オブジェクトキャッシュ
        - Customize
          - 最小 TTL,最大 TTL, デフォルト TTL 共通
            - 31536000
        - レスポンスヘッダポリシー
          - なにもしない
  - 関数の関連付け
    - ビューワーリクエスト
      - Lambda@Edge
        - arn:aws:lambda:us-east-1:118834186871:function:mcreinfo-set-prerender-header:2
        - 本文を含めるにチェックしない
    - オリジンリクエスト
      - Lambda@Edge
        - arn:aws:lambda:us-east-1:118834186871:function:mcreinfo-redirect-to-prerender:1
        - 本文を含めるにチェックしない
  - 設定
    - デフォルトルートオブジェクト
      - index.html
    - 代替ドメイン名(CNAME)
      - dqw.mcre.info
    - カスタム SSL 証明書
      - mcre.info を選択
      - ほかデフォルト
    - ほかデフォルト

---

作成した後に修正

- タグ
  - project
    - dqw.mcre.info
- カスタムエラーレスポンスを作成
  - エラーコード
    - 403
  - TTL
    - 0
  - エラーレスポンスをカスタマイズ
    - はい
      - レスポンスページのパス
        - /
      - レスポンスコード
        - 200


### Route 53 設定

- ホストゾーン → mcre.info
- レコードを作成
  - クイック作成
  - レコード名
    - dqw.mcre.info
  - レコードタイプ
    - A
  - エイリアスを有効化
    - CloudFront ディストリビューションへのエイリアス
      - dqw.mcre.info
  - ルーティングポリシー
    - シンプルルーティング


## License

- MIT
  - see LICENSE
