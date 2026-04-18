const Calculator = {
    /**
     * HPの実数値を計算する。
     * @param {*} base HP種族値
     * @param {*} point HP能力ポイント
     * @returns HP実数値
     */
    calculateHp: ( base, point) => {
        let status = 0;
        if ( base != 0) {
            status = base + CONST.CALC.BASE_HP_ADDITION + point;
        }
        return status;
    },

    /**
     * HP"以外"の実数値を計算する。
     * @param {*} base 種族値
     * @param {*} point 能力ポイント
     * @param {*} nature 性格補正
     * @returns 実数値
     */
    calculateStatus: ( base, point, nature) => {
        let status = 0;
        if ( base != 0) {
            status = Math.floor( (base + CONST.CALC.BASE_STATUS_ADDITION + point) * nature);
        }
        return status;
    },

    /**
     * 技の物理/特殊に合わせて攻撃種族値を取得します。
     * @param {*} pokemon ポケモン
     * @param {*} move 技
     * @returns こうげき/とくこうの種族値
     */
    getAttackerBaseStatusByMoveCategory: ( pokemon, move) => {
        let statusLabel = CONST.STATUS.ATK;
        let attackerStatus = 0;

        // 技未設定の場合は物理
        if ( pokemon) {
            statusLabel = CONST.STATUS.ATK;
            attackerStatus = pokemon.baseStats.atk;
        }

        // 特殊の場合
        if ( pokemon && move && move.category === CONST.CATEGORY.SPECIAL) {
            statusLabel = CONST.STATUS.SPA;
            attackerStatus = pokemon.baseStats.spa;
        }

        return {
            label: statusLabel,
            status: attackerStatus
        };
    },

    /**
     * HPの種族値を取得します。
     * @param {*} pokemon ポケモン
     * @returns HPの種族値
     */
    getHpBaseStatus: ( pokemon) => {
        let hpStatus = 0;
        if ( pokemon) {
            hpStatus = pokemon.baseStats.hp;
        }
        return hpStatus;
    },

    /**
     * 技の物理/特殊に合わせて防御種族値を取得します。
     * @param {*} pokemon ポケモン
     * @param {*} move 技
     * @returns ぼうぎょ/とくぼうの種族値
     */
    getDefenderBaseStatusByMoveCategory: ( pokemon, move) => {
        let statusLabel = CONST.STATUS.DEF;
        let defenderStatus = 0;
        let pointLabel = CONST.POINT.DEF;

        // 技未設定の場合は物理
        if ( pokemon) {
            defenderStatus = pokemon.baseStats.def;
        }

        // 特殊の場合
        if ( pokemon && move && move.category === CONST.CATEGORY.SPECIAL) {
            statusLabel = CONST.STATUS.SPD;
            defenderStatus = pokemon.baseStats.spd;
            pointLabel = CONST.POINT.SPD;
        }

        return {
            label: statusLabel,
            status: defenderStatus,
            pointLabel: pointLabel
        };
    },

    /**
     * ポケモンと技がタイプ一致しているか
     * @param {*} pokemon ポケモン
     * @param {*} move わざ
     * @returns 一致している場合は true
     */
    isSameType: ( pokemon, move) => {
        let sameType = false;
        if ( pokemon && move) {
            sameType = pokemon.types.includes( move.type);
        }
        return sameType;        
    },

    /**
     * 技と受けるポケモンからタイプ相性を取得します。
     * @param {*} move 技
     * @param {*} defender 受けるポケモン
     * @returns タイプ相性の倍率
     */
    getEffectiveness: ( move, defender) => {
        const moveType = move.type;
        const chart = CONST.TYPE_CHART[ moveType];
        const defenderTypes = defender.types;
 
        let multiplier = 1.0;
        if ( !chart || !defenderTypes) {
            return multiplier;
        }

        defenderTypes.forEach( defenderType => {
            if ( chart[ defenderType] !== undefined) {
                multiplier *= chart[ defenderType];
            }
        });
        return multiplier;
    },

    /**
     * ダメージ計算をする。
     * @param {*} attack 攻撃/特攻の実数値
     * @param {*} power 技威力
     * @param {*} defense 防御/特防の実数値
     * @param {*} multiplier タイプ相性の倍率
     * @param {*} sameType タイプ一致か
     * @returns 最小/最大ダメージ
     */
    calculateDamage: ( attack, power, defense, multiplier, sameType) => {
        // 基本ダメージ
        let base = Math.floor( CONST.CALC.LEVEL_CONST * attack * power / defense);
        let baseDamage = Math.floor(  base / CONST.CALC.CALC_DAMAGE_DIVISOR) + CONST.CALC.CALC_DAMAGE_ADDITION;

        // タイプ補正
        if ( sameType) {
            baseDamage = Math.floor( baseDamage * CONST.CALC.SAME_TYPE_MULTIPLIER);
        }

        // タイプ相性
        baseDamage = Math.floor( baseDamage * multiplier);

        // 乱数（最小/最大ダメージ）
        return {
            min: Math.floor( baseDamage * CONST.CALC.RANDOM_MIN),
            max: Math.floor( baseDamage * CONST.CALC.RANDOM_MAX)
        };
    },

};
