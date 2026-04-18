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
        HP: "HP能力ポイント",
        ATK: "こうげき能力ポイント",
        DEF: "ぼうぎょ能力ポイント",
        SPA: "とくこう能力ポイント",
        SPD: "とくぼう能力ポイント",
        SPE: "すばやさ能力ポイント",
    },
    CATEGORY: {
        PHYSICAL: "physical",
        SPECIAL: "special",
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
