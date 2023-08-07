# Next.js, Djangoを使ったInstagramっぽい画像投稿サイト

参考：https://zenn.dev/hathle/books/next-drf-image-post-book

## 起動方法
Makefileでdockerイメージのビルドとdocker compose upを行う処理を書いているため、以下のコマンドで起動できる。

```shell
make up
```

起動後は http://localhost:3000 でサイトにアクセスすることが可能。


## 終了方法
```shell
make down
```

## 機能

- 実装済み
  - アカウント
    - 登録
    - プロフィール編集（名前、画像）
  - 投稿
    - 一覧
    - 作成（テキスト、画像）
    - 編集
    - 削除
- 未実装
  - アカウント
    - 削除
    - フォロー
  - 投稿
    - 返信
    - リアクション（いいね、引用）
    - 公開範囲

## 備考

- 現状はbackendコンテナ内にDBをファイルとして保存しており、特にマウントする設定をしていないので永続化できていない
- NginxやRedis（キャッシュ）などは使用していない
