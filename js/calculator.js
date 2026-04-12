/**
 * ダメージ計算を実行する関数
 */
function calculateDamage( attack, power, defense, multiplier) {
    // Lv50固定で定数化できる計算部分
    const levelConstant = 22; // (50 * 2 / 5 + 2)

    // レベル部分 * 威力 * 攻撃力 * 防御力 (切り捨て)
    let base = Math.floor( levelConstant * power * attack / defense);
    // 基本ダメージ (切り捨て)
    let baseDamage = Math.floor( base / 50) + 2;

    // タイプ相性の補正 (切り捨て)
    baseDamage = Math.floor( baseDamage * multiplier);

    // 乱数幅の計算 (0.85倍 〜 1.00倍)
    const maxDamage = baseDamage;
    const minDamage = Math.floor( baseDamage * 0.85);

    return {
        min: minDamage,
        max: maxDamage
    };
}
