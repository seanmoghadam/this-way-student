module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended"],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": ["react"],
    "rules": {
        "react/prop-types": 0,
        "linebreak-style": ["error", "unix"],
        "semi": ["error", "always"],
        "no-console": 0
    }
};
