# Tracewright Narrative Uncertainty Map 日本語ガイド

Tracewright Narrative Uncertainty Map は、文章や資料を「AIか人間か」で判定するための道具ではありません。

論文、草稿、創作、メール、公開発言、ニュースレター、来歴資料、複数資料のセットなどを、自分のAIと一緒に読み直すためのレビュー補助ツールです。

目的は、結論を急ぐことではなく、次のような点を見える化することです。

- どの主張に根拠が必要か
- どこに矛盾、抜け、弱い論点があるか
- どの資料が何を証明できて、何を証明できないか
- 文章が編集、翻訳、AI補助、共同執筆などでどう変形している可能性があるか
- 次に何を確認、修正、質問、保留すべきか

## 推奨: Windows Workbenchを使う

Windows 10/11の64ビットPCでは、ローカル版のTracewright Workbenchをインストールできます。これが、現在のTracewrightを一連の流れで使うための主な入口です。

**[Tracewright Workbench v0.3.0-betaをダウンロード](https://github.com/ayakoredon/tracewright-narrative-uncertainty-map/releases/download/workbench-v0.3.0-beta/Tracewright-Workbench-Setup-v0.3.0-beta.exe)**

Workbenchでは、次の作業をひとつの画面から進められます。

- レビューの目的とモードを最初に決める
- 分析対象と周辺コンテクストを分けて資料を登録する
- 自分で選んだAIへ渡す、範囲を限定したレビュー用ファイルを作る
- AIが返したJSONを読み込む
- Summary、Claims、Evidence、Sources、Follow-upから、観察の根拠や代替説明を確認する

インストールすると、スタートメニューと、希望する場合はデスクトップにショートカットが作られます。資料とレビュー結果は自分のPC内に保存され、TracewrightやAyakoのサーバーへ自動送信されることはありません。AIへ渡す場合だけ、自分で選んだAI環境へレビュー用ファイルをアップロードします。

現在は未署名のWindows x64向けβ版です。Windows SmartScreenの警告が出る場合があります。必ず、この公式GitHubリポジトリから取得したものだけを実行してください。チェックサムや更新内容は[リリースページ](https://github.com/ayakoredon/tracewright-narrative-uncertainty-map/releases/tag/workbench-v0.3.0-beta)で確認できます。

## インストール前にデモを見る

**[ダッシュボード形式の公開デモを開く](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/)**

公開デモでは、架空の私信、論文、公開言説、作品来歴などを使い、レビュー結果をどう読むか確認できます。実際の私信、未公開原稿、個人資料は含まれていません。

## Windows以外・インストールなしで使う

Macを使っている場合や、アプリを入れず普段のAIチャットだけで試したい場合は、[Starter Kit](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/downloads/tracewright-narrative-starter-kit-v0.6.zip)を使えます。

ZIPを解凍したら、まず `START_HERE.ja.md` を開いてください。いちばん簡単な使い方は、`USE_THIS_WITH_YOUR_AI.ja.md` を ChatGPT、Claude、Gemini など普段使っているAIに添付し、そこに書かれている短い開始文をチャット画面に貼ることです。

そのAIが、ファイルを読めたか確認し、アップロード前の注意を伝え、どんなレビューをしたいか質問してくれる想定です。出力はWorkbenchではなく、Markdown形式のレビュー地図になります。

実際のチャットに近い見え方は、[Simple AI Reviewの例](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/simple-ai-example.html)で確認できます。

## 注意

Tracewrightは、プライバシー保護や機密管理を自動で行うものではありません。

未公開資料、個人情報、第三者の資料、法的に慎重な資料、機密資料をAIにアップロードする前に、そのAI環境に入れてよいものか必ず確認してください。

不安がある場合は、最初は匿名化、要約、抜粋、架空資料、公開済み資料で試してください。

## ライセンスと商用利用

Tracewright Narrative Uncertainty Map は、個人、教育、研究、非商用のレビュー作業には無料で使えます。

ただし、Tracewrightのコンセプト、名称、方法論、スターターキット、ダッシュボード、プロンプト、テンプレート、特徴的なレビュー構造を、無断で商用利用することは許可していません。

商用サービス、販売用ツール、有料ワークフロー、ホステッド型プラットフォーム、製品組み込みなどに使いたい場合は、事前にAyako Redonへ連絡してください。

詳しくは `LICENSE` と `COMMERCIAL_USE.ja.md` を確認してください。





