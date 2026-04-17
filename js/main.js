document.addEventListener( 'DOMContentLoaded', () => {
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

        let isSameType = false;
        if (attacker && move) {
            // 攻撃側のタイプ配列に、技のタイプが含まれているかチェック
            isSameType = attacker.types.includes(move.type);
        }

        // 計算実行
        const result = calculateDamage( attack, power, defense, multiplier, isSameType);

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

// 攻撃側の実数値更新
function updateAttackerStats() {
    const name = document.getElementById( CONST.SELECTOR.ATTACKER_NAME).value;
    const point = Number( document.getElementById( CONST.SELECTOR.ATTACKER_POINT).value);
    const nature = parseFloat(document.getElementById( CONST.SELECTOR.ATTACKER_NATURE).value);
    const moveName = document.getElementById( CONST.SELECTOR.MOVE_NAME).value;
    const statsInput = document.getElementById( CONST.SELECTOR.ATTACKER_STATS);
    const labelEl = document.getElementById( CONST.SELECTOR.ATTACKER_STATS_LABEL);

    const pokemon = pokemonMasterData.find( p => p.name === name);
    const move = moveMasterData.find( m => m.name === moveName);

    // 能力ポイントを初期化
    if (!pokemon || point === "") {
        statsInput.value = 0;
        return;
    }

    let base = pokemon.baseStats.atk;
    labelEl.textContent = CONST.STATUS.ATK;

    if ( move && move.category === CONST.CATEGORY.SPECIAL) {
        base = pokemon.baseStats.spa;
        labelEl.textContent = CONST.STATUS.SPA;
    }

    // (種族値 + 20 + ポイント) * 性格補正
    const actual = Math.floor( ( base + 20 + point) * nature);
    statsInput.value = actual;
}

// 攻撃側の全初期化
function resetAttackerConfig( fullReset = false) {
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

// 攻撃側ポケモン名の変更アクション
document.getElementById( CONST.SELECTOR.ATTACKER_NAME).addEventListener( 'input', (e) => {
    if ( e.target.value === "") {
        // ポケモン未設定
        resetAttackerConfig( true);
    } else {
        const pokemon = pokemonMasterData.find( p => p.name === e.target.value);
        if ( pokemon) {
            resetAttackerConfig( false); 
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

// 防御側の実数値を更新する関数
function updateDefenderStats() {
    const name = document.getElementById( CONST.SELECTOR.DEFENDER_NAME).value;
    const hpPoint = Number( document.getElementById( CONST.SELECTOR.DEFENDER_HP_POINT).value);
    const defPoint = Number( document.getElementById( CONST.SELECTOR.DEFENDER_DEF_POINT).value);
    const hpInput = document.getElementById( CONST.SELECTOR.DEFENDER_HP_STATS);
    const statsInput = document.getElementById( CONST.SELECTOR.DEFENDER_DEF_STATS);
    const nature = parseFloat( document.getElementById( CONST.SELECTOR.DEFENDER_NATURE).value);
    const moveName = document.getElementById( CONST.SELECTOR.MOVE_NAME).value;
    const labelEl = document.getElementById( CONST.SELECTOR.DEFENDER_DEF_STATS_LABEL);
    const defPointLabelEl = document.getElementById( CONST.SELECTOR.DEFENDER_DEF_POINT_LABEL);

    const pokemon = pokemonMasterData.find( p => p.name === name);
    const move = moveMasterData.find( m => m.name === moveName);

    // 能力ポイントを初期化
    if (!pokemon || hpPoint === "" || defPoint === "") {
        hpInput.value = 0;
        statsInput.value = 0;
        return;
    }

    // HP実数値の計算: 種族値 + 75 + ポイント
    const actualHp = pokemon.baseStats.hp + 75 + hpPoint;

    let base = pokemon.baseStats.def;
    labelEl.textContent = CONST.STATUS.DEF;
    defPointLabelEl.textContent = CONST.POINT.DEF;

    if ( move && move.category === "special") {
        base = pokemon.baseStats.spd;
        labelEl.textContent = CONST.STATUS.SPD;
        defPointLabelEl.textContent = CONST.POINT.SPD;
    }
    // 防御実数値の計算: (種族値 + 20 + ポイント) * 性格補正
    const actualDef = Math.floor( (base + 20 + defPoint) * nature);

    document.getElementById( CONST.SELECTOR.DEFENDER_HP_STATS).value = actualHp;
    document.getElementById( CONST.SELECTOR.DEFENDER_DEF_STATS).value = actualDef;
}

// 防御側のイベント登録
document.getElementById( CONST.SELECTOR.DEFENDER_NAME).addEventListener( 'input', updateDefenderStats);
document.getElementById( CONST.SELECTOR.DEFENDER_HP_POINT).addEventListener( 'input', updateDefenderStats);
document.getElementById( CONST.SELECTOR.DEFENDER_DEF_POINT).addEventListener( 'input', updateDefenderStats);
document.getElementById( CONST.SELECTOR.DEFENDER_NATURE).addEventListener( 'change', updateDefenderStats);

// 防御側の全初期化
function resetDefenderConfig( fullReset = false) {
    if ( fullReset) {
        document.getElementById( CONST.SELECTOR.DEFENDER_NAME).value = "";
    }
    document.getElementById( CONST.SELECTOR.DEFENDER_NATURE).value = "1.0";
    document.getElementById( CONST.SELECTOR.DEFENDER_HP_POINT).value = 0;
    document.getElementById( CONST.SELECTOR.DEFENDER_DEF_POINT).value = 0;
    document.getElementById( CONST.SELECTOR.TYPE_MULTIPLIER).value = "1.00";
    updateDefenderStats();
}

// 防御側ポケモン名の変更アクション
document.getElementById( CONST.SELECTOR.DEFENDER_NAME).addEventListener( 'input', (e) => {
    if ( e.target.value === "") {
        // ポケモン未設定
        resetDefenderConfig( true);
    } else {
        const pokemon = pokemonMasterData.find( p => p.name === e.target.value);
        if ( pokemon) {
            resetDefenderConfig( false); 
        }
    }
});

let pokemonMasterData = [];
let moveMasterData = [];

// データの読み込み
async function loadData() {
    try {
        const response = await fetch( 'data/pokemon.json');
        const data = await response.json();
        pokemonMasterData = data.pokemon;

        const list = document.getElementById( CONST.SELECTOR.POKEMON_LIST);
        pokemonMasterData.forEach( p => {
            const option = document.createElement( 'option');
            option.value = p.name;
            list.appendChild( option);
        });
        console.log( "ポケモンデータを読み込みました");

        const moveRes = await fetch( 'data/moves.json');
        const moveData = await moveRes.json();
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

// 技とタイプ一致補正の更新
function updateMovePower() {
    const moveName = document.getElementById( CONST.SELECTOR.MOVE_NAME).value;
    const move = moveMasterData.find(m => m.name === moveName);

    if (move) {
        document.getElementById( CONST.SELECTOR.MOVE_POWER).value = move.power;
    }
}

document.getElementById( CONST.SELECTOR.MOVE_NAME).addEventListener('input', updateMovePower);

// Service Workerの登録
if ( 'serviceWorker' in navigator) {
    navigator.serviceWorker.register( 'sw.js')
        .then(() => console.log( 'Service Worker Registered'));
}
