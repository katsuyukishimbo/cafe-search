# カフェ混雑マップアプリ - デプロイガイド

このドキュメントでは、カフェ混雑マップアプリのデプロイ手順について説明します。

## 前提条件

- Node.js 16.x 以上
- npm または yarn
- Firebase アカウント
- Google Cloud Platform アカウント（Google Maps API 用）

## 手順

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/cafe-congestion-map.git
cd cafe-congestion-map
```

### 2. 依存関係のインストール

```bash
npm install
# または
yarn install
```

### 3. 環境変数の設定

`.env.local` ファイルを作成し、必要な環境変数を設定します：

```
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=あなたのGoogleMapsAPIキー

# Firebase設定
NEXT_PUBLIC_FIREBASE_API_KEY=あなたのFirebaseAPIキー
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=あなたのFirebaseAuthドメイン
NEXT_PUBLIC_FIREBASE_PROJECT_ID=あなたのFirebaseプロジェクトID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=あなたのFirebaseストレージバケット
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=あなたのFirebaseメッセージ送信者ID
NEXT_PUBLIC_FIREBASE_APP_ID=あなたのFirebaseアプリID

# APIエンドポイント（Cloud Functions）
NEXT_PUBLIC_API_BASE_URL=あなたのFirebaseFunctionsのURL
```

### 4. Firebase プロジェクトの設定

1. Firebase Console (https://console.firebase.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. Cloud Firestore を有効化
4. Web アプリを追加し、設定情報をコピー
5. Firebase CLI をインストール

```bash
npm install -g firebase-tools
```

6. Firebase にログイン

```bash
firebase login
```

7. プロジェクトの初期化

```bash
firebase init
```

- Firestore, Functions, Hosting を選択
- 既存のプロジェクトを選択
- デフォルトのオプションを選択（functions ディレクトリなど）

### 5. Google Maps API の設定

1. Google Cloud Platform Console (https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または Firebase と同じプロジェクトを使用）
3. Maps JavaScript API, Places API, Geocoding API を有効化
4. API キーを作成し、適切な制限を設定（リファラーや IP アドレス制限など）

### 6. Cloud Functions の設定

1. `functions/index.js` に必要な環境変数を設定

```bash
cd functions
npm install
firebase functions:config:set google.maps_api_key="あなたのGoogleMapsAPIキー"
firebase functions:config:set line.notify_token="あなたのLINE通知トークン"
```

### 7. Firestore のセキュリティルール設定

`firestore.rules` ファイルを以下のように編集：

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 店舗情報は誰でも読み取り可能
    match /stores/{storeId} {
      allow read: if true;
      // 書き込みは認証済みユーザーのみ（本番環境では適切に設定）
      allow write: if false;
    }

    // アプリ更新情報は管理者のみアクセス可能
    match /app_updates/{updateId} {
      allow read, write: if false;
    }
  }
}
```

### 8. ビルドとデプロイ

1. Next.js アプリケーションをビルド

```bash
npm run build
# または
yarn build
```

2. Firebase へデプロイ

```bash
firebase deploy
```

### 9. 定期実行の設定

Cloud Functions の定期実行（スケジュール）が正しく設定されていることを確認します。

Firebase Console で:

1. Functions > スケジュール済みタスク を確認
2. `updateCongestionData` と `detectNewApps` が表示されていることを確認

## 本番環境の考慮事項

1. **認証**: 本番環境では、管理者ページやストア登録ページのための適切な認証システム（Firebase Authentication）を実装してください。

2. **API キーの制限**: Google Maps API キーには、適切なドメイン制限や IP アドレス制限を設定してください。

3. **セキュリティルール**: Firestore のセキュリティルールを本番環境に適したものに更新してください。

4. **スケーリング**: トラフィックが増加した場合に備えて、適切なスケーリング戦略を考慮してください。

5. **監視**: エラー監視とログ記録を設定し、問題を早期に検出できるようにしてください。

6. **バックアップ**: 定期的なデータバックアップ戦略を実装してください。

## トラブルシューティング

### Cloud Functions のログ確認

```bash
firebase functions:log
```

### Firestore のインデックス作成

複雑なクエリを実行する場合、Firebase Console でインデックスの作成が必要になることがあります。コンソールのエラーメッセージに従ってインデックスを作成してください。

### API キーの問題

Google Maps API の呼び出しでエラーが発生する場合は、API キーに適切な権限があることと、対応する API が有効化されていることを確認してください。

### デプロイの問題

デプロイに問題がある場合は、以下を確認してください：

1. Firebase CLI が最新バージョンか
2. 適切な権限があるか
3. プロジェクト設定が正しいか

詳細なエラーメッセージを確認し、Firebase Support Docs を参照してください。
