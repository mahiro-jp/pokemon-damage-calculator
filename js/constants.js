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
    TYPE_CHART: {
        "どく": { "くさ": 2, "いわ": 0.5, "どく": 0.5, "じめん": 0.5, "ゴースト": 0.5, "はがね": 0, "フェアリー": 2},
        "じめん": { "くさ": 0.5, "ほのお": 2, "でんき": 2, "むし": 0.5, "ひこう": 0, "いわ": 2, "どく": 2, "はがね": 2},
        "かくとう": { "ノーマル": 2, "むし": 0.5, "ひこう": 0.5, "いわ": 2, "どく": 0.5, "こおり": 2, "エスパー": 0.5, "ゴースト": 0, "あく": 2, "はがね": 2, "フェアリー": 0.5},
        "ゴースト": { "ノーマル": 0, "エスパー": 2, "ゴースト": 2, "あく": 0.5},
        "ドラゴン": { "ドラゴン": 2, "はがね": 0.5, "フェアリー": 0},
    },
};

Object.freeze( CONST);
