document.addEventListener( 'DOMContentLoaded', () => {
    loadData();

    const calcBtn = document.getElementById( 'calc-btn');

    calcBtn.addEventListener( 'click', () => {
        // 入力値の取得
        const attack = Number( document.getElementById('attacker-stats').value);
        const power = Number( document.getElementById('move-power').value);
        const multiplier = parseFloat( document.getElementById('type-multiplier').value);
        const hp = Number( document.getElementById('defender-hp').value);
        const defense = Number( document.getElementById('defender-stats').value);

        // 2. タイプ一致補正の判定
        const attackerName = document.getElementById( 'attacker-name').value;
        const moveName = document.getElementById( 'move-name').value;

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
        const rangeEl = document.getElementById( 'damage-range');
        const percentEl = document.getElementById( 'damage-percent');
        rangeEl.textContent = `${result.min} ～ ${result.max}`;

        // 割合の計算 (ダメージ / HP * 100)
        const minPercent = ((result.min / hp) * 100).toFixed(1);
        const maxPercent = ((result.max / hp) * 100).toFixed(1);
        percentEl.textContent = `${minPercent}% ～ ${maxPercent}%`;
    });
});

// 攻撃側の実数値更新
function updateAttackerStats() {
    const name = document.getElementById( 'attacker-name').value;
    const point = Number( document.getElementById( 'attacker-point').value);
    const nature = parseFloat(document.getElementById( 'attacker-nature').value);
    const moveName = document.getElementById( 'move-name').value;
    const statsInput = document.getElementById( 'attacker-stats');
    const labelEl = document.getElementById( 'attacker-stats-label');

    const pokemon = pokemonMasterData.find( p => p.name === name);
    const move = moveMasterData.find( m => m.name === moveName);

    // 能力ポイントを初期化
    if (!pokemon || point === "") {
        statsInput.value = 0;
        return;
    }

    let base = pokemon.baseStats.atk;
    labelEl.textContent = "攻撃実数値";

    if ( move && move.category === "special") {
        base = pokemon.baseStats.spa;
        labelEl.textContent = "特攻実数値";
    }

    // (種族値 + 20 + ポイント) * 性格補正
    const actual = Math.floor( ( base + 20 + point) * nature);
    statsInput.value = actual;
}

// 攻撃側の全初期化
function resetAttackerConfig( fullReset = false) {
    if ( fullReset) {
        document.getElementById( 'attacker-name').value = "";
    }
    document.getElementById( 'attacker-nature').value = "1.0";
    document.getElementById( 'attacker-point').value = 32;
    document.getElementById( 'move-name').value = "";
    document.getElementById( 'move-power').value = 0;
    document.getElementById( 'type-multiplier').value = "1.00";
    updateAttackerStats();
}

// 攻撃側ポケモン名の変更アクション
document.getElementById( 'attacker-name').addEventListener( 'input', (e) => {
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
document.getElementById( 'move-name').addEventListener( 'input', (e) => {
    const move = moveMasterData.find( m => m.name === e.target.value);
    const powerInput = document.getElementById( 'move-power');

    if ( move) {
        powerInput.value = move.power;
    } else {
        powerInput.value = 0;
    }
    document.getElementById( 'type-multiplier').value = "1.00";
    updateAttackerStats();
    updateDefenderStats();
});

// 攻撃側のイベント登録
document.getElementById( 'attacker-name').addEventListener( 'input', updateAttackerStats);
document.getElementById( 'attacker-point').addEventListener( 'input', updateAttackerStats);
document.getElementById( 'attacker-nature').addEventListener( 'change', updateAttackerStats);

// 防御側の実数値を更新する関数
function updateDefenderStats() {
    const name = document.getElementById( 'defender-name').value;
    const hpPoint = Number( document.getElementById( 'defender-hp-point').value);
    const defPoint = Number( document.getElementById( 'defender-def-point').value);
    const hpInput = document.getElementById( 'defender-hp');
    const statsInput = document.getElementById( 'defender-stats');
    const nature = parseFloat( document.getElementById( 'defender-nature').value);
    const moveName = document.getElementById( 'move-name').value;
    const labelEl = document.getElementById( 'defender-stats-label');
    const defPointLabelEl = document.getElementById( 'defender-def-point-label');

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
    labelEl.textContent = "防御実数値";
    defPointLabelEl.textContent = "防御能力ポイント";

    if ( move && move.category === "special") {
        base = pokemon.baseStats.spd;
        labelEl.textContent = "特防実数値";
        defPointLabelEl.textContent = "特防能力ポイント";
    }
    // 防御実数値の計算: (種族値 + 20 + ポイント) * 性格補正
    const actualDef = Math.floor( (base + 20 + defPoint) * nature);

    document.getElementById( 'defender-hp').value = actualHp;
    document.getElementById( 'defender-stats').value = actualDef;
}

// 防御側のイベント登録
document.getElementById( 'defender-name').addEventListener( 'input', updateDefenderStats);
document.getElementById( 'defender-hp-point').addEventListener( 'input', updateDefenderStats);
document.getElementById( 'defender-def-point').addEventListener( 'input', updateDefenderStats);
document.getElementById( 'defender-nature').addEventListener( 'change', updateDefenderStats);

// 防御側の全初期化
function resetDefenderConfig( fullReset = false) {
    if ( fullReset) {
        document.getElementById( 'defender-name').value = "";
    }
    document.getElementById( 'defender-nature').value = "1.0";
    document.getElementById( 'defender-hp-point').value = 0;
    document.getElementById( 'defender-def-point').value = 0;
    document.getElementById( 'type-multiplier').value = "1.00";
    updateDefenderStats();
}

// 防御側ポケモン名の変更アクション
document.getElementById( 'defender-name').addEventListener( 'input', (e) => {
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

        const list = document.getElementById( 'pokemon-list');
        pokemonMasterData.forEach( p => {
            const option = document.createElement( 'option');
            option.value = p.name;
            list.appendChild( option);
        });
        console.log( "ポケモンデータを読み込みました");

        const moveRes = await fetch( 'data/moves.json');
        const moveData = await moveRes.json();
        moveMasterData = moveData.moves;

        const moveList = document.getElementById( 'move-list');
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
    const moveName = document.getElementById('move-name').value;
    const move = moveMasterData.find(m => m.name === moveName);

    if (move) {
        document.getElementById('move-power').value = move.power;
    }
}

document.getElementById('move-name').addEventListener('input', updateMovePower);

// Service Workerの登録
if ( 'serviceWorker' in navigator) {
    navigator.serviceWorker.register( 'sw.js')
        .then(() => console.log( 'Service Worker Registered'));
}
