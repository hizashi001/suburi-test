# 回避判定ラボ（使い捨ての実験）

本編「NINJA SAMURAI WORKOUT: GHOST」（`../suburi-bugeicho`）とは別物。本編のファイルは読み込まず、編集もしない。
終わったらこのフォルダを丸ごと消してよい。

- ページ：`index.html` の1枚だけ（外部の部品は CDN から読む）
- 骨格推定：本編と同じ MediaPipe tasks-vision 0.10.14 / PoseLandmarker（lite、VIDEO、GPU→CPU）。比較用に full も選べる
- ログ：ブラウザの localStorage（`dodgelab.log.v1`）。ラボCで JSON に書き出す

## 段階

1. 骨組み（カメラ・骨格表示・FPS表示・ログ）済み
2. ラボA（指標・基準・ラベル判定・下がりの距離・閾値のスライダーと再判定）← 今ここ
3. ラボB 4. 連撃・誤検知・ラボC 5. 任意項目
