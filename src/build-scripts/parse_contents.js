// todo ts-nodeと組み合わせてTypeScriptで書き直す

const kuromoji = require("kuromoji");
// import {calcTextWidth} from "../scripts/helpers";
const $ = require("jquery");
const jp = require("jsonpath");
const escapeHtml = require("escape-html");

let tokenizer = null;

async function getTokenizer() {
  if (tokenizer) return tokenizer;

  $(window).on("tokenizerReady", function () {
    return tokenizer;
  })

}

async function tokenizeText(text) {
  return ensureNotUndefinedOrNull(await getTokenizer()).tokenize(text);
}

function splitText(tokens, ignoreSpace) {
  let resultTerms = [];

  let charsBuffer = '';
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const tokenText = token["surface_form"];

    if (i !== tokens.length - 1) {
      if (token["pos"] === "助詞"
        || (!ignoreSpace && token["pos"] === "記号" && token["pos_detail_1"] === "空白")
        || tokenText === "," || tokenText === "，"
        || token["surface_form"].length > 15) {
        charsBuffer += tokenText;
        resultTerms.push(charsBuffer);
        charsBuffer = '';
      } else {
        charsBuffer += tokenText;
      }
    } else {
      charsBuffer += tokenText;
      resultTerms.push(charsBuffer);
    }
  }

  return resultTerms;
}

function splitContentTextsIntoTerms(contents) {

  const PARSE_TARGET_PATHS = [
    "$.affiliations[*].ja[*]",
    "$.affiliations[*].en[*]",
    "$.contact.email",
    "$.education[*].affiliation.ja",
    "$.education[*].affiliation.en",
    "$.researches[*].detail.ja",
    "$.researches[*].detail.en",
    "$.publications.domestic[*].title",
    "$.publications.domestic[*].conference",
    "$.awards[*].scene",
    "$.works[*].entries[*].detail"
  ];

  return new Promise((resolve, reject) => {
    kuromoji.builder({dicPath: "node_modules/kuromoji/dict"}).build(function (err, tokenizer) {
      if (err) reject(err);

      PARSE_TARGET_PATHS.forEach((path) => {
        jp.apply(contents, path, function (value) {
          return splitText(tokenizer.tokenize(value));
        });
      });

      resolve(contents);
    });
  });

}

function escapeContents(contents) {
  return new Promise((resolve) => {
    jp.apply(contents, "$..*", function (value) {
      if (typeof value === "string") {
        return escape(value); // todo escape()はdeprecated
      }
      return value
    });
    resolve(contents);
  });
}

exports.splitContentTextsIntoTerms = splitContentTextsIntoTerms;
exports.escapeContents = escapeContents;
