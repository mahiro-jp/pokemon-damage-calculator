const UI = {
    attacker: {
        name: document.getElementById( "attacker-name"),
        nature: document.getElementById( "attacker-nature"),
        point: document.getElementById( "attacker-point"),
        statusLabel: document.getElementById( "attacker-stats-label"),
        status: document.getElementById( "attacker-stats"),
        moveName: document.getElementById( "move-name"),
        movePower: document.getElementById( "move-power"),
        typeMultiplier: document.getElementById( "type-multiplier"),
    },
    defender: {
        name: document.getElementById( "defender-name"),
        nature: document.getElementById( "defender-nature"),
        hpPoint: document.getElementById( "defender-hp-point"),
        hpStatus: document.getElementById( "defender-hp-stats"),
        defPointLabel: document.getElementById( "defender-def-point-label"),
        defPoint: document.getElementById( "defender-def-point"),
        defStatusLabel: document.getElementById( "defender-def-stats-label"),
        defStatus: document.getElementById( "defender-def-stats"),
    },
    common: {
        pokemonList: document.getElementById( "pokemon-list"),
        moveList: document.getElementById( "move-list"), 
        calcBtn: document.getElementById( "calc-btn"),
        damageRange: document.getElementById( "damage-range"),
        damagePercent: document.getElementById( "damage-percent"),
    },
}

const inputElements = [
    UI.attacker.name,
    UI.attacker.nature,
    UI.attacker.point,
    UI.attacker.moveName,
    UI.attacker.movePower,
    UI.attacker.typeMultiplier,
    UI.defender.name,
    UI.defender.nature,
    UI.defender.hpPoint,
    UI.defender.defPoint
];

// 入力項目にイベントを一括設定
inputElements.forEach ( el => {
    el.addEventListener( 'input', updateAll);
});

// ポケモン変更時は入力項目を初期化する
UI.attacker.name.addEventListener( 'change', resetAttacker);
UI.defender.name.addEventListener( 'change', resetDefender);

// 計算ボタンの処理
UI.common.calcBtn.addEventListener( 'click', executeDamageCalculation);

// ポケモンデータ
let pokemonMasterData = [];
// 技データ
let moveMasterData = [];

// データ読み込み
document.addEventListener( 'DOMContentLoaded', () => {
    loadData();
    updateAll();
});

/**
 * データを読み込みます。
 */
async function loadData() {
    try {
        const pokemonResponse = await fetch( 'data/pokemon.json');
        const pokemonData = await pokemonResponse.json();
        pokemonMasterData = pokemonData.pokemon;

        const pokemonList = UI.common.pokemonList;
        pokemonMasterData.forEach( p => {
            const option = document.createElement( 'option');
            option.value = p.name;
            pokemonList.appendChild( option);
        });
        console.log( "ポケモンデータを読み込みました");

        const moveResponse = await fetch( 'data/moves.json');
        const moveData = await moveResponse.json();
        moveMasterData = moveData.moves;

        const moveList = UI.common.moveList;
        moveMasterData.forEach( m => {
            const option = document.createElement( 'option');
            option.value = m.name;
            moveList.appendChild( option);
        });
        console.log( "技データを読み込みました");
    } catch ( error) {
        console.error( "データの読み込みに失敗しました", error);
    }
}

/**
 * 画面全体を更新する
 */
function updateAll() {
    // 攻撃側の更新
    updateAttackerStats();
    // 防御側の更新
    updateDefenderStats();
    // 技情報の更新
    updateMoveInfo();
}

/**
 * 攻撃側の値を更新する
 */
function updateAttackerStats() {
    // ポケモンの入力情報
    const attackerName = UI.attacker.name.value;
    const nature = parseFloat( UI.attacker.nature.value || 1.0);
    const point = Number( UI.attacker.point.value || 0);
    const moveName = UI.attacker.moveName.value;

    // こうげき/とくこうの項目
    const statusLabel = UI.attacker.statusLabel;
    const statsInput = UI.attacker.status;

    // データ取得
    const pokemon = pokemonMasterData.find( p => p.name === attackerName);
    const move = moveMasterData.find( m => m.name === moveName);

    // 技の物理/特殊に合わせて実数値を計算
    const attackerBaseStatus = Calculator.getAttackerBaseStatusByMoveCategory( pokemon, move);
    let status = Calculator.calculateStatus( attackerBaseStatus.status, point, nature);

    // 実数値を画面に反映
    statusLabel.textContent = attackerBaseStatus.label;
    statsInput.value = status;
}

/**
 * 防御側の値を更新する。
 */
function updateDefenderStats() {
    // ポケモンの入力情報
    const pokemonName = UI.defender.name.value;
    const nature = parseFloat( UI.defender.nature.value);
    const hpPoint = Number( UI.defender.hpPoint.value);
    const defPoint = Number( UI.defender.defPoint.value);
    const moveName = UI.attacker.moveName.value;

    // HP、ぼうぎょ/とくぼうの項目
    const defPointLabel = UI.defender.defPointLabel;
    const hpStatusInput = UI.defender.hpStatus;
    const defStatsLabel = UI.defender.defStatusLabel;
    const defStatsInput = UI.defender.defStatus;

    // データ取得
    const pokemon = pokemonMasterData.find( p => p.name === pokemonName);
    const move = moveMasterData.find( m => m.name === moveName);

    // HPの計算
    let hpBaseStatus = Calculator.getHpBaseStatus( pokemon);
    let hpStatus = Calculator.calculateHp( hpBaseStatus, hpPoint);

    // 技の物理/特殊に合わせて実数値を計算
    const defenderBaseStatus = Calculator.getDefenderBaseStatusByMoveCategory( pokemon, move);
    let defStatus = Calculator.calculateStatus( defenderBaseStatus.status, defPoint, nature);

    // 実数値を画面に反映
    hpStatusInput.value = hpStatus;
    defPointLabel.textContent = defenderBaseStatus.pointLabel;
    defStatsLabel.textContent = defenderBaseStatus.label;
    defStatsInput.value = defStatus;
}

/**
 * 技の情報を更新する
 */
function updateMoveInfo() {
    const moveName = UI.attacker.moveName.value;
    const move = moveMasterData.find( m => m.name === moveName);

    UI.attacker.movePower.value = 0;
    UI.attacker.typeMultiplier.value = "1.00";

    if (move) {
        UI.attacker.movePower.value = move.power;
        // TODO タイプ相性の自動判定
    }
}

/**
 * 攻撃側の初期化
 */
function resetAttacker() {
    UI.attacker.nature.value = "1.0";
    UI.attacker.point.value = 32;
    UI.attacker.moveName.value = "";
    UI.attacker.movePower.value = 0;
    UI.attacker.typeMultiplier.value = "1.00";

    updateAttackerStats();
}

/**
 * 防御側の初期化
 */
function resetDefender() {
    UI.defender.nature.value = "1.0";
    UI.defender.hpPoint.value = 0;
    UI.defender.defPoint.value = 0;
    UI.attacker.typeMultiplier.value = "1.00";

    updateDefenderStats();
}

/**
 * ダメージ計算を実行する
 */
function executeDamageCalculation() {
    const attack = Number( UI.attacker.status.value);
    const hp = Number( UI.defender.hpStatus.value);
    const defense = Number( UI.defender.defStatus.value);
    const movePower = Number( UI.attacker.movePower.value);
    const multiplier = parseFloat( UI.attacker.typeMultiplier.value);

    const attackerName = UI.attacker.name.value;
    const attacker = pokemonMasterData.find( p => p.name === attackerName);
    const moveName = UI.attacker.moveName.value;
    const move = moveMasterData.find( m => m.name === moveName);

    const sameType = Calculator.isSameType( attacker, move);

    // 計算処理
    const result = Calculator.calculateDamage( attack, movePower, defense, multiplier, sameType);

    const rangeEl = UI.common.damageRange;
    rangeEl.textContent = `${result.min} ～ ${result.max}`;

    const percentEl = UI.common.damagePercent;
    const minPercent = ( ( result.min / hp) * 100).toFixed(1);
    const maxPercent = ( ( result.max / hp) * 100).toFixed(1);
    percentEl.textContent = `${minPercent}% ～ ${maxPercent}%`;
}

// Service Workerの登録
if ( 'serviceWorker' in navigator) {
    navigator.serviceWorker.register( 'sw.js')
        .then(() => console.log( 'Service Worker Registered'));
}
