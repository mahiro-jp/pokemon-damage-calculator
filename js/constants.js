const CONST = {
    STATUS: {
        HP: "HP",
        ATK: "こうげき",
        DEF: "ぼうぎょ",
        SPA: "とくこう",
        SPD: "とくぼう",
        SPE: "すばやさ",
    },
    POINT: {
        ATK: "能力ポイント",
        DEF: "ぼうぎょ能力ポイント",
        SPD: "とくぼう能力ポイント",
    },
    CATEGORY: {
        PHYSICAL: "physical",
        SPECIAL: "special",
    },
    SELECTOR: {
        // 攻撃側
        ATTACKER_NAME: "attacker-name",
        ATTACKER_NATURE: "attacker-nature",
        ATTACKER_POINT: "attacker-point",
        ATTACKER_STATS_LABEL: "attacker-stats-label",
        ATTACKER_STATS: "attacker-stats",
        MOVE_NAME: "move-name",
        MOVE_POWER: "move-power",
        MOVE_TYPE: "move-type",
        TYPE_MULTIPLIER: "type-multiplier",

        // 防御側
        DEFENDER_NAME: "defender-name",
        DEFENDER_NATURE: "defender-nature",
        DEFENDER_HP_POINT: "defender-hp-point",
        DEFENDER_HP_STATS: "defender-hp-stats",
        DEFENDER_DEF_POINT_LABEL: "defender-def-point-label",
        DEFENDER_DEF_POINT: "defender-def-point",
        DEFENDER_DEF_STATS_LABEL: "defender-def-stats-label",
        DEFENDER_DEF_STATS: "defender-def-stats",

        // ダメージ計算側
        CALC_BTN: "calc-btn",
        DAMAGE_RANGE: "damage-range",
        DAMAGE_PERCENT: "damage-percent",

        // その他
        POKEMON_LIST: "pokemon-list",
        MOVE_LIST: "move-list",
    },
    CALC: {
        BASE_HP_ADDITION: 75,
        BASE_STATUS_ADDITION: 20,
        LEVEL_CONST: 22,
        CALC_DAMAGE_DIVISOR: 50,
        CALC_DAMAGE_ADDITION: 2,
        SAME_TYPE_MULTIPLIER: 1.5,
        RANDOM_MIN: 0.85,
        RANDOM_MAX: 1.00,
    },
};

Object.freeze( CONST);
