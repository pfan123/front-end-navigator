module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "subject-case": [
      0,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "revert"],
    ],
  },
};
