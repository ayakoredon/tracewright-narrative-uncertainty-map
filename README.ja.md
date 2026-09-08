# Tracewright Narrative Uncertainty Map 日本語ガイド

Tracewright Narrative Uncertainty Map は、文章や資料を「AIか人間か」で判定するための道具ではありません。

論文、草稿、創作、メール、公開発言、ニュースレター、来歴資料、複数資料のセットなどを、自分のAIと一緒に読み直すためのレビュー補助ツールです。

目的は、結論を急ぐことではなく、次のような点を見える化することです。

- どの主張に根拠が必要か
- どこに矛盾、抜け、弱い論点があるか
- どの資料が何を証明できて、何を証明できないか
- 文章が編集、翻訳、AI補助、共同執筆などでどう変形している可能性があるか
- 次に何を確認、修正、質問、保留すべきか

## 新しい入口: 業務フローもレビューするReview Lab

2026年9月8日の英語版Review Labでは、文書の中身に加えて、AIや自動処理を組み込んだ業務全体を見直せます。「人間に渡した」という記録だけでなく、誰が受け取り、原資料を確認でき、訂正や停止が後続処理に届いているかを、資料・イベント記録・観察カードから追うための例です。

- [英語デモを開く](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/)
- [ローカル用Review Lab ZIPをダウンロード](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/downloads/tracewright-review-lab-2026-09-08-en.zip)
- [新しい業務レビューの情報登録フォーム](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/intake.html?kind=workflow)
- [同梱内容・制限・起動方法（英語）](docs/review-lab-download.md)

ZIPを展開して `index.html` を開くと、架空の文書レビュー7件と業務レビュー2件を閲覧できます。業務例は、多言語のお客様窓口と、本番環境への一時アクセス権申請です。すべて架空の設定であり、実際の組織や事故、AIの性能測定結果ではありません。

フォームは情報整理、下書きの保存・JSON入出力、自分のAIに渡す依頼文の準備に使えます。ファイル本文の読み込み、AIへの送信、自動分析、分析結果のダッシュボードへの取り込みは行いません。AIへ何を渡すかは、内容と送信先の条件を確認して別途判断してください。

Review Labは監査や検証の準備を支援するもので、監査完了・法令適合・安全性を保証しません。未確認は問題の存在を意味せず、提案した対応と実施・検証済みの対応は区別します。重要な判断には適切な専門性と責任を持つ人のレビューが必要です。

**画面・フォームは英語版です。この日本語ガイドがあることは、アプリ全体が日本語対応済みという意味ではありません。** 静的Review Lab ZIPだけではWindowsアプリは更新されません。下記のWorkbench 0.5では、このデモとフォームをWindows版へ統合しています。ライセンスと商用利用条件は変更していません。

## 推奨: Windows Workbenchを使う

Windows 10/11の64ビットPCでは、ローカル版のTracewright Workbenchをインストールできます。これが、現在のTracewrightを一連の流れで使うための主な入口です。

**[Tracewright Workbench v0.5.0-betaをダウンロード](https://github.com/ayakoredon/tracewright-narrative-uncertainty-map/releases/download/workbench-v0.5.0-beta/Tracewright-Workbench-Setup-v0.5.0-beta.exe)**

[インストール不要のWindows ZIP](https://github.com/ayakoredon/tracewright-narrative-uncertainty-map/releases/download/workbench-v0.5.0-beta/tracewright-workbench-windows-v0.5.0-beta.zip)もあります。フォルダー全体を展開してください。

Workbenchでは、次の作業をひとつの画面から進められます。

- レビューの目的とモードを最初に決める
- 分析対象と周辺コンテクストを分けて資料を登録する
- 業務フローのヒアリングフォームからローカル案件を作成する
- 原本に照らして分析用テキストを確認し、送信する範囲を選ぶ
- 自分のCodexへ確認済みテキストを送るか、手動転送用ZIPを作る
- AIが返したJSONの形式・資料ID・引用の一致を検査して取り込む
- Summary、Claims、Evidence、Sources、Follow-up、Flow & Controlsから根拠や代替説明を確認する

インストールすると、スタートメニューと、希望する場合はデスクトップにショートカットが作られます。資料と結果は自分のPC内に保存されます。原本ファイルが自動的にAIへ送信されることはありません。選択した分析用テキストとレビュー依頼は、送信を承認した場合にCodex経由でプロバイダーへ渡ります。

**送信前に、自分のCodexまたは利用するAIで、アカウント・ワークスペース、保存期間、学習への利用、所属組織の規則、資料を共有する権限を確認してください。TWはそれらを自動確認できません。** 自動接続はChatGPTでログインした対応版Codexを使い、APIキーへの切り替えはしません。Codexの利用枠を消費します。既存のチャット・メモリーを引き継がない独立した分析です。

PDFや古いOffice形式などは、原本に照らした抜粋・書き起こしの入力が必要です。DOCX/ODTも本文抽出のため、脚注・図表などの欠落を確認してください。結果の検査は構造と参照の検査であり、分析の正しさを保証するものではありません。更新前には `%LOCALAPPDATA%\Tracewright\Workbench` をバックアップしてください。

現在は未署名のWindows x64向けβ版です。Windows SmartScreenの警告が出る場合があります。公式GitHubリポジトリの配布物を確認してください。チェックサムや更新内容は[リリースページ](https://github.com/ayakoredon/tracewright-narrative-uncertainty-map/releases/tag/workbench-v0.5.0-beta)で確認できます。

## インストール前にデモを見る

**[ダッシュボード形式の公開デモを開く](https://ayakoredon.github.io/tracewright-narrative-uncertainty-map/)**

公開デモでは、架空の私信、論文、公開言説、作品来歴などを、Workbenchへ結果を読み込んだ後に近い閲覧専用画面で確認できます。実際の私信、未公開原稿、個人資料は含まれていません。Summary、Claims、Evidence、Sources、Follow-upを辿りながら、観察の根拠と次の確認行動を確認できます。

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





