import React from "react";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">このサービスについて</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">カフェ混雑マップとは</h2>
        <p className="mb-4">
          カフェ混雑マップは、カフェやファミレスなどの飲食店舗のリアルタイムな混雑情報を
          地図上で視覚的に把握できるサービスです。勉強や仕事、打ち合わせの場所を探す際に、
          あらかじめ混雑状況を確認することで、スムーズに店舗選びができます。
        </p>
        <p>
          また、各店舗の公式アプリやLINE公式アカウントがある場合は、そちらへ簡単に
          アクセスできるようリンクも提供しています。詳細な待ち時間や席の空き状況などは
          公式サービスで確認することができます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">データについて</h2>
        <p className="mb-4">混雑情報は主に以下のソースから取得しています：</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Google Maps APIのリアルタイム人気度情報</li>
          <li>各店舗の公式アプリやWebサイトから提供されるAPIデータ</li>
          <li>過去の利用傾向から算出した予測データ</li>
        </ul>
        <p className="text-sm text-gray-600">
          ※ 混雑状況は常に変動するため、実際の状況と異なる場合があります。
          最新かつ正確な情報は、店舗の公式サービスで確認することをおすすめします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">使い方</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">1. 地図から店舗を探す</h3>
            <p>
              地図上で色分けされたマーカーを確認します。緑色は空いている店舗、
              黄色は混雑している店舗、赤色は非常に混雑している店舗を示しています。
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">2. フィルター機能を使う</h3>
            <p>
              右上のフィルターボタンから、店舗タイプや混雑度でフィルタリングができます。
              公式アプリがある店舗のみの表示も可能です。
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">3. 詳細情報を確認する</h3>
            <p>
              マーカーをクリックすると、その店舗の詳細情報が表示されます。
              公式アプリやLINE公式アカウントへのリンクがある場合は、
              そちらから最新の待ち時間や席の予約などが可能です。
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">お問い合わせ</h2>
        <p className="mb-4">
          ご意見・ご要望・お問い合わせは以下のメールアドレスまでお願いします。
        </p>
        <p className="bg-gray-100 p-3 rounded text-center">
          info@cafe-congestion-map.example.com
        </p>
      </section>
    </div>
  );
}
