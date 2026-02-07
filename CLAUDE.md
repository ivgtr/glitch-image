# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

グリッチエフェクト付きSVG画像を動的に生成するVercelサーバーレスAPI。テキストまたは画像URLを受け取り、RGBチャンネル分離アニメーション付きのSVGを返す。

## コマンド

- `npm start` — Vercel開発サーバー起動 (`vercel dev`)
- テストフレームワークは未導入

## コードスタイル

- ESLint: `eslint-config-sumikko` (Node.js + TypeScript + Prettier統合)
- Prettier: セミコロンなし、シングルクォート、トレイリングカンマなし、100文字幅、2スペースインデント
- TypeScript: strict mode有効、未使用変数・パラメータ禁止

## アーキテクチャ

```
api/index.ts          — Vercelサーバーレス関数エントリポイント
  └─ src/svg.ts       — SVG生成メインロジック (createElement)
      ├─ src/create.ts — 要素ファクトリ (画像fetch+base64変換 / テキスト要素生成)
      ├─ src/tag.ts    — HTML/SVGタグ文字列ビルダー
      └─ src/style.ts  — CSSスタイル/ダークモードメディアクエリ生成
```

- `api/index.ts`: クエリパラメータ(`text`, `url`, `width`, `height`, `color`, `darkColor`, `fontSize`)を受け取り、`createElement()`でSVGを生成して返す。2時間キャッシュ設定。
- `src/svg.ts`: SVGフィルタチェーン(colorMatrix → feOffset → feBlend → feMerge)でグリッチエフェクトを構築。3秒周期のアニメーション。
- `src/create.ts`: `createImageElement`はaxiosで画像取得→base64変換→image-sizeで寸法取得。`createTextElement`はテキストSVG要素を生成。
- 型定義は `src/@types/Query.d.ts` にクエリパラメータの型がある。

## デプロイ

Vercelにデプロイ。`vercel.json`で `/` → `/api` にリダイレクト設定。
