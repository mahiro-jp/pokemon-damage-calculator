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

// ポケモンデータ
let pokemonMasterData = [];
// 技データ
let moveMasterData = [];

document.addEventListener( 'DOMContentLoaded', () => {
    // データ読み込み
    loadData();

    UI.common.calcBtn.addEventListener( 'click', () => {
        // 入力値の取得
        const attack = Number( UI.attacker.status.value);
        const power = Number( UI.attacker.movePower.value);
        const multiplier = parseFloat( UI.attacker.typeMultiplier.value);
        const hp = Number( UI.defender.hpStatus.value);
        const defense = Number( UI.defender.defStatus.value);

        // 2. タイプ一致補正の判定
        const attackerName = UI.attacker.name.value;
        const moveName = UI.attacker.moveName.value;

        // データ群から選択中の個体を特定
        const attacker = pokemonMasterData.find( p => p.name === attackerName);
        const move = moveMasterData.find( m => m.name === moveName);

        let isSameType = Calculator.isSameType( attacker, move);

        // 計算実行
        const result = Calculator.calculateDamage( attack, power, defense, multiplier, isSameType);

        // 結果の表示
        const rangeEl = UI.common.damageRange;
        const percentEl = UI.common.damagePercent;
        rangeEl.textContent = `${result.min} ～ ${result.max}`;

        // 割合の計算 (ダメージ / HP * 100)
        const minPercent = ((result.min / hp) * 100).toFixed(1);
        const maxPercent = ((result.max / hp) * 100).toFixed(1);
        percentEl.textContent = `${minPercent}% ～ ${maxPercent}%`;
    });
});

// 攻撃側ポケモン名の変更アクション
UI.attacker.name.addEventListener( 'input', (e) => {
    if ( e.target.value === "") {
        // ポケモン未設定
        resetAttacker( true);
    } else {
        const pokemon = pokemonMasterData.find( p => p.name === e.target.value);
        if ( pokemon) {
            resetAttacker( false); 
        }
    }
});

// 技名の変更アクション
UI.attacker.moveName.addEventListener( 'input', (e) => {
    const move = moveMasterData.find( m => m.name === e.target.value);
    const powerInput = UI.attacker.movePower;

    if ( move) {
        powerInput.value = move.power;
    } else {
        powerInput.value = 0;
    }
    UI.attacker.typeMultiplier.value = "1.00";
    updateAttackerStats();
    updateDefenderStats();
});

// 攻撃側のイベント登録
UI.attacker.name.addEventListener( 'input', updateAttackerStats);
UI.attacker.point.addEventListener( 'input', updateAttackerStats);
UI.attacker.nature.addEventListener( 'change', updateAttackerStats);

// 防御側のイベント登録
UI.defender.name.addEventListener( 'input', updateDefenderStats);
UI.defender.hpPoint.addEventListener( 'input', updateDefenderStats);
UI.defender.defPoint.addEventListener( 'input', updateDefenderStats);
UI.defender.nature.addEventListener( 'change', updateDefenderStats);

// 防御側ポケモン名の変更アクション
UI.defender.name.addEventListener( 'input', (e) => {
    if ( e.target.value === "") {
        // ポケモン未設定
        resetDefender( true);
    } else {
        const pokemon = pokemonMasterData.find( p => p.name === e.target.value);
        if ( pokemon) {
            resetDefender( false); 
        }
    }
});

// 技とタイプ一致補正の更新
function updateMovePower() {
    const moveName = UI.attacker.moveName.value;
    const move = moveMasterData.find(m => m.name === moveName);

    if (move) {
        UI.attacker.movePower.value = move.power;
    }
}

UI.attacker.moveName.addEventListener('input', updateMovePower);

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
 * 攻撃側の初期化
 * @param {*} fullReset ポケモンもクリアするか
 */
function resetAttacker( fullReset = false) {
    if ( fullReset) {
        UI.attacker.name.value = "";
    }
    UI.attacker.nature.value = "1.0";
    UI.attacker.point.value = 32;
    UI.attacker.moveName.value = "";
    UI.attacker.movePower.value = 0;
    UI.attacker.typeMultiplier.value = "1.00";

    updateAttackerStats();
}

/**
 * 防御側の初期化
 * @param {*} fullReset ポケモンもクリアするか
 */
function resetDefender( fullReset = false) {
    if ( fullReset) {
        UI.defender.name.value = "";
    }
    UI.defender.nature.value = "1.0";
    UI.defender.hpPoint.value = 0;
    UI.defender.defPoint.value = 0;
    UI.attacker.typeMultiplier.value = "1.00";

    updateDefenderStats();
}

// Service Workerの登録
if ( 'serviceWorker' in navigator) {
    navigator.serviceWorker.register( 'sw.js')
        .then(() => console.log( 'Service Worker Registered'));
}
