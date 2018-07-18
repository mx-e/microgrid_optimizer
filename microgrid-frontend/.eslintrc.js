module.exports = {
    extends: ["standard", "eslint:recommended", "plugin:react/recommended"],
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      }
    },
    env: {
      browser: 1,
      jasmine: true
    },
    plugins: ["react", "jasmine"],
    rules:{
      "react/display-name": "off",
      "react/prop-types": "off",
      "no-new-wrappers": "off",
      "indent": ["error"],
      "no-var": 2,
      "no-console": "off",
      "no-unused-vars": ["error", {"args":"after-used"}]
    }
  }
