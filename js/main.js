// ポケモンデータ
let pokemonMasterData = [];
// 技データ
let moveMasterData = [];

document.addEventListener( 'DOMContentLoaded', () => {
    // データ読み込み
    loadData();

    const calcBtn = document.getElementById( CONST.SELECTOR.CALC_BTN);

    calcBtn.addEventListener( 'click', () => {
        // 入力値の取得
        const attack = Number( document.getElementById( CONST.SELECTOR.ATTACKER_STATS).value);
        const power = Number( document.getElementById( CONST.SELECTOR.MOVE_POWER).value);
        const multiplier = parseFloat( document.getElementById( CONST.SELECTOR.TYPE_MULTIPLIER).value);
        const hp = Number( document.getElementById( CONST.SELECTOR.DEFENDER_HP_STATS).value);
        const defense = Number( document.getElementById( CONST.SELECTOR.DEFENDER_DEF_STATS).value);

        // 2. タイプ一致補正の判定
        const attackerName = document.getElementById( CONST.SELECTOR.ATTACKER_NAME).value;
        const moveName = document.getElementById( CONST.SELECTOR.MOVE_NAME).value;

        // データ群から選択中の個体を特定
        const attacker = pokemonMasterData.find( p => p.name === attackerName);
        const move = moveMasterData.find( m => m.name === moveName);

        let isSameType = Calculator.isSameType( attacker, move);

        // 計算実行
        const result = Calculator.calculateDamage( attack, power, defense, multiplier, isSameType);

        // 結果の表示
        const rangeEl = document.getElementById( CONST.SELECTOR.DAMAGE_RANGE);
        const percentEl = document.getElementById( CONST.SELECTOR.DAMAGE_PERCENT);
        rangeEl.textContent = `${result.min} ～ ${result.max}`;

        // 割合の計算 (ダメージ / HP * 100)
        const minPercent = ((result.min / hp) * 100).toFixed(1);
        const maxPercent = ((result.max / hp) * 100).toFixed(1);
        percentEl.textContent = `${minPercent}% ～ ${maxPercent}%`;
    });
});

// 攻撃側ポケモン名の変更アクション
document.getElementById( CONST.SELECTOR.ATTACKER_NAME).addEventListener( 'input', (e) => {
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
document.getElementById( CONST.SELECTOR.MOVE_NAME).addEventListener( 'input', (e) => {
    const move = moveMasterData.find( m => m.name === e.target.value);
    const powerInput = document.getElementById( CONST.SELECTOR.MOVE_POWER);

    if ( move) {
        powerInput.value = move.power;
    } else {
        powerInput.value = 0;
    }
    document.getElementById( CONST.SELECTOR.TYPE_MULTIPLIER).value = "1.00";
    updateAttackerStats();
    updateDefenderStats();
});

// 攻撃側のイベント登録
document.getElementById( CONST.SELECTOR.ATTACKER_NAME).addEventListener( 'input', updateAttackerStats);
document.getElementById( CONST.SELECTOR.ATTACKER_POINT).addEventListener( 'input', updateAttackerStats);
document.getElementById( CONST.SELECTOR.ATTACKER_NATURE).addEventListener( 'change', updateAttackerStats);

// 防御側のイベント登録
document.getElementById( CONST.SELECTOR.DEFENDER_NAME).addEventListener( 'input', updateDefenderStats);
document.getElementById( CONST.SELECTOR.DEFENDER_HP_POINT).addEventListener( 'input', updateDefenderStats);
document.getElementById( CONST.SELECTOR.DEFENDER_DEF_POINT).addEventListener( 'input', updateDefenderStats);
document.getElementById( CONST.SELECTOR.DEFENDER_NATURE).addEventListener( 'change', updateDefenderStats);

// 防御側ポケモン名の変更アクション
document.getElementById( CONST.SELECTOR.DEFENDER_NAME).addEventListener( 'input', (e) => {
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
    const moveName = document.getElementById( CONST.SELECTOR.MOVE_NAME).value;
    const move = moveMasterData.find(m => m.name === moveName);

    if (move) {
        document.getElementById( CONST.SELECTOR.MOVE_POWER).value = move.power;
    }
}

document.getElementById( CONST.SELECTOR.MOVE_NAME).addEventListener('input', updateMovePower);

/**
 * データを読み込みます。
 */
async function loadData() {
    try {
        const pokemonResponse = await fetch( 'data/pokemon.json');
        const pokemonData = await pokemonResponse.json();
        pokemonMasterData = pokemonData.pokemon;

        const pokemonList = document.getElementById( CONST.SELECTOR.POKEMON_LIST);
        pokemonMasterData.forEach( p => {
            const option = document.createElement( 'option');
            option.value = p.name;
            pokemonList.appendChild( option);
        });
        console.log( "ポケモンデータを読み込みました");

        const moveResponse = await fetch( 'data/moves.json');
        const moveData = await moveResponse.json();
        moveMasterData = moveData.moves;

        const moveList = document.getElementById( CONST.SELECTOR.MOVE_LIST);
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
    const attackerName = document.getElementById( CONST.SELECTOR.ATTACKER_NAME).value;
    const nature = parseFloat( document.getElementById( CONST.SELECTOR.ATTACKER_NATURE).value || 1.0);
    const point = Number( document.getElementById( CONST.SELECTOR.ATTACKER_POINT).value || 0);
    const moveName = document.getElementById( CONST.SELECTOR.MOVE_NAME).value;

    // こうげき/とくこうの項目
    const statusLabel = document.getElementById( CONST.SELECTOR.ATTACKER_STATS_LABEL);
    const statsInput = document.getElementById( CONST.SELECTOR.ATTACKER_STATS);

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
    const pokemonName = document.getElementById( CONST.SELECTOR.DEFENDER_NAME).value;
    const nature = parseFloat( document.getElementById( CONST.SELECTOR.DEFENDER_NATURE).value);
    const hpPoint = Number( document.getElementById( CONST.SELECTOR.DEFENDER_HP_POINT).value);
    const defPoint = Number( document.getElementById( CONST.SELECTOR.DEFENDER_DEF_POINT).value);
    const moveName = document.getElementById( CONST.SELECTOR.MOVE_NAME).value;

    // HP、ぼうぎょ/とくぼうの項目
    const defPointLabel = document.getElementById( CONST.SELECTOR.DEFENDER_DEF_POINT_LABEL);
    const hpStatusInput = document.getElementById( CONST.SELECTOR.DEFENDER_HP_STATS);
    const defStatsLabel = document.getElementById( CONST.SELECTOR.DEFENDER_DEF_STATS_LABEL);
    const defStatsInput = document.getElementById( CONST.SELECTOR.DEFENDER_DEF_STATS);

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
        document.getElementById( CONST.SELECTOR.ATTACKER_NAME).value = "";
    }
    document.getElementById( CONST.SELECTOR.ATTACKER_NATURE).value = "1.0";
    document.getElementById( CONST.SELECTOR.ATTACKER_POINT).value = 32;
    document.getElementById( CONST.SELECTOR.MOVE_NAME).value = "";
    document.getElementById( CONST.SELECTOR.MOVE_POWER).value = 0;
    document.getElementById( CONST.SELECTOR.TYPE_MULTIPLIER).value = "1.00";

    updateAttackerStats();
}

/**
 * 防御側の初期化
 * @param {*} fullReset ポケモンもクリアするか
 */
function resetDefender( fullReset = false) {
    if ( fullReset) {
        document.getElementById( CONST.SELECTOR.DEFENDER_NAME).value = "";
    }
    document.getElementById( CONST.SELECTOR.DEFENDER_NATURE).value = "1.0";
    document.getElementById( CONST.SELECTOR.DEFENDER_HP_POINT).value = 0;
    document.getElementById( CONST.SELECTOR.DEFENDER_DEF_POINT).value = 0;
    document.getElementById( CONST.SELECTOR.TYPE_MULTIPLIER).value = "1.00";

    updateDefenderStats();
}

// Service Workerの登録
if ( 'serviceWorker' in navigator) {
    navigator.serviceWorker.register( 'sw.js')
        .then(() => console.log( 'Service Worker Registered'));
}
