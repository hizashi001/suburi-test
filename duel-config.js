// 拍の決闘ラボ（duel.html）の設定。使い捨ての実験用。本編とは無関係。
// 数字や表を書き換えて保存し、ページを開き直せば効きます（ページは毎回この設定を読み直します）。
// 段階3から rules・table・npc も使います（段階3で選べる相手は鉄心だけ）。
export default {
  // 1拍の長さ（ms）の選択肢
  beatMsChoices: [1200, 1000, 800],

  // ---------- 判定（段階1〜2） ----------
  judge: {
    kamaeRegMs: 3000,      // 構えの登録：1つの構えを何ms止まって記録するか
    kamaeMaxDist: 3.0,     // 構えの見分け：登録した構えとの「離れ具合」がこれ以下なら、その構えとみなす（大きいほど甘い）
    reanchorMs: 1000,      // 毎ターンの入力の前の「構え直し」の長さ
    reanchorMoveMax: 0.05, // 構え直しの間に、肩の横の揺れ（胴の長さ比）がこれより大きければ「動いていた」と記録する
    timingSwings: 8,       // タイミング調整で振る回数
    timingClampFrac: 0.35,  // 拍の窓の中心のずれ（調整値）を、1拍の±35%までに抑える
    attack: { thrustZ: 0.6, vertDeg: 20, horizDeg: 60 }, // 突き＝前へ（向きの前後成分がこれ以上で一番大きい）／縦＝縦から20°以内／横＝縦から60°より寝ている（duel-3d：斬り上げ24°→逆風、胴65°→斬り上げ を受けて 25/65 から変更。真向は1〜8°だった）
    timingWin: [-0.4, 0.9],
    // 太刀筋のきれいさ（相打ちのときだけ使う）。面＝一つの面に乗っているか／速さ＝速さの山÷speedRef(m/秒)／止め＝速さの山から止まるまでが短いか（stopMs で0点）
    clean: { planeW: 1, speedW: 1, stopW: 1, speedRef: 8, stopMs: 400 },
    npcClean: [0.3, 0.8], // 相手の太刀筋の点数（まずは乱数）
    bodySwing: { peakMin: 3, ms: 300 }, // 体の動き（ステップ・下がり・しゃがみ・かがみ）が300ms以上の拍では、速さ3m/秒未満の振りと、しゃがみ中の振り下ろしは攻撃にしない
    exceptBack: { ms: 300, min: 0.08 },
    // 拍の後半（窓の終わりの35%）で構えに戻って止まっていれば「構え」。そのとき、窓の前の35%に山がある振り（前の技から戻る動き）と防御は数えない
    // kamaeRate＝手が登録した構えの形のコマの割合／handMax＝肩から見た手の速さ m/秒／hip・drop・back・lean＝ターンの初めの姿勢からのずれ（胴の長さ比）
    settle: { frac: 0.35, atkFrom: 0.35, kamaeRate: 0.7, handMax: 1.5, hip: 0.25, drop: 0.15, back: 0.08, lean: 0.15 }, // duel-3h：構えに戻った位置が少しずれても戻ったとみなすよう、腰0.15→0.25・下がり0.05→0.08・上体0.12→0.15・構えの割合0.8→0.7・手1.2→1.5に緩めた // 例外「下がりながら振りかぶり→下がり」は、下がりが300ms以上・縮み0.08以上のときだけ（振ると胴の見かけが縮むため） // タイミング調整：ドンの何拍前〜何拍後の振りを、そのドンの振りとみなすか
    offscreenFrac: 0.5,    // 1拍の窓のうち、骨格が取れない時間がこれ以上なら棒立ち（段階2で使う）
    // 回避の閾値（前回の回避判定ラボ v4 の値。胴の長さ＝肩の中点〜腰の中点を1とする）
    th: {
      crouch: 0.35,  // しゃがみ：肩の中点の沈み
      step: 0.3,     // ステップ：腰の中点の横ずれ
      leanX: 0.15,   // かがみ左右：足は動かさず上体を左右へ倒す（肩の中点が腰の中点より横に出た量）。腰が動けばステップ
      sway: 0.08,    // 上体の前後 m（仮）
      back: 0.05,    // 下がり：胴と脚の見かけの縮み
      holdMs: 150,   // 続いた時間
    },
    // 素振りの検出（前回のラボと同じ。手首は肩の中点から見た3D位置で測る）
    swing: { start: 1.6, stop: 0.6, onset: 0.45, minAmp: 0.18, maxMs: 1600 },
  },

  // ---------- 対戦のルール（段階3以降） ----------
  rules: {
    hpStart: 100, spStart: 100, hpMax: 100, spMax: 100,
    spCostAttack: 15, spCostDefense: 5,
    kamaeRecover: 20, hassoRecover: 10,
    maxTurns: 7, beatsPerTurn: 4,
    clashDamage: 5, cleanBonus: 5,        // 相打ち：双方5、太刀筋のきれいな方がさらに5
    openDamage: 20,                       // 構え（棒立ちを含む）に攻撃が入った
    grade: {                              // 防御の評価ごとの結果
      "優": { damage: 0, heal: 10, nextAttack: 10 },
      "良": { damage: 0, heal: 0, nextAttack: 10 },
      "可": { damage: 5, heal: 0, nextAttack: 0 },
      "不": { damage: 10, heal: 0, nextAttack: 0 },
    },
    kamaeBonus: 5,
  },

  // シンプルなルール（攻撃・防御・構えの3つ。どの攻撃・どの防御でも同じ扱い。構えの種類の補正・相性表・太刀筋は使わない）
  simple: {
    clash: 10,        // 攻撃 対 攻撃：お互いに
    kamaeHit: 20,     // 攻撃 対 構え（棒立ちを含む）：受けた側に
    defenseBonus: 5,  // 攻撃 対 防御：防御は必ず成功、防いだ側の次の攻撃に +5
  },

  // 構え。bonus は、その構えで +5 になる攻撃
  kamae: {
    jodan: { name: "上段", bonus: ["makko", "kesaR", "kesaL"] },
    chudan: { name: "中段", bonus: ["doR", "doL", "tsukiR", "tsukiL"] },
    gedan: { name: "下段", bonus: ["kiriageR", "kiriageL", "gyakufu"] },
    hasso: { name: "八相", bonus: [], guardOnKamae: true },
  },

  attacks: {
    makko: "真向", kesaR: "袈裟・右", kesaL: "袈裟・左", doR: "胴・右", doL: "胴・左",
    kiriageR: "斬り上げ・右", kiriageL: "斬り上げ・左", gyakufu: "逆風", tsukiR: "突き・右寄り", tsukiL: "突き・左寄り",
  },
  defenses: {
    stepL: "ステップ左", stepR: "ステップ右", back: "下がり", kagamiL: "かがみ左", kagamiR: "かがみ右", crouch: "しゃがみ", tachi: "刀立て",
  },

  // 相性表（セルは受ける側の評価。左右は受ける側の体から見た向き）
  // 列の順番は cols のとおり。行は「優 良 可 不」を空白で区切って7つ
  table: {
    cols: ["stepL", "stepR", "back", "kagamiL", "kagamiR", "crouch", "tachi"],
    rows: {
      makko:    "優 優 可 不 不 不 良",
      kesaR:    "不 優 良 不 優 不 可",
      kesaL:    "優 不 良 優 不 不 可",
      doR:      "不 不 良 不 不 優 良",
      doL:      "不 不 良 不 不 優 良",
      kiriageR: "優 不 良 優 不 良 可",
      kiriageL: "不 優 良 不 優 良 可",
      gyakufu:  "優 優 可 不 不 不 不",
      tsukiR:   "優 不 不 優 不 可 可",
      tsukiL:   "不 優 不 不 優 可 可",
    },
  },

  // ---------- 相手（NPC、段階3以降） ----------
  // mix は 攻撃・防御・構え の選びやすさ。likes に書いた行動は、書いていない行動の likeWeight 倍選ばれやすい
  npc: {
    likeWeight: 3,
    lowSp: 40, lowSpKamaeMul: 3,     // SPが40未満なら構えを3倍
    lowHp: 35, lowHpDefenseMul: 1.5, // HPが35未満なら防御を1.5倍
    list: {
      tesshin: { name: "鉄心", kamae: "chudan", mix: { attack: 55, defense: 30, kamae: 15 }, likes: ["tsukiR", "tsukiL", "doR", "doL", "back", "tachi"] },
      hidaka:  { name: "火鷹", kamae: "jodan", mix: { attack: 65, defense: 25, kamae: 10 }, likes: ["makko", "kesaR", "kesaL", "stepL", "stepR"] },
      seisai:  { name: "静斎", kamae: "hasso", mix: { attack: 35, defense: 40, kamae: 25 }, likes: ["kiriageR", "kiriageL", "gyakufu", "crouch", "stepL", "stepR"] },
      // 写し身：基本の割合は指示書に無いので仮の値（段階4で確認する）
      // 突きの右寄り／左寄り＝突く前に手を引いた位置が、プレイヤーの体のどちら側か（段階2で判定する）
      utsushimi: { name: "写し身", kamae: "chudan", mix: { attack: 50, defense: 35, kamae: 15 }, likes: [], mirror: true },
    },
  },
};
