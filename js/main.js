document.addEventListener( 'DOMContentLoaded', () => {
    const calcBtn = document.getElementById( 'calc-btn');

    calcBtn.addEventListener( 'click', () => {
        // 入力値の取得
        const attack = Number( document.getElementById('attacker-stats').value);
        const power = Number( document.getElementById('move-power').value);
        const multiplier = parseFloat( document.getElementById('type-multiplier').value);
        const hp = Number( document.getElementById('defender-hp').value);
        const defense = Number( document.getElementById('defender-stats').value);

        // 計算実行
        const result = calculateDamage( attack, power, defense, multiplier);

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

// Service Workerの登録
if ( 'serviceWorker' in navigator) {
    navigator.serviceWorker.register( 'sw.js')
        .then(() => console.log( 'Service Worker Registered'));
}
