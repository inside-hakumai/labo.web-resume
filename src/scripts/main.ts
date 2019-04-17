import $ from "jquery";
import ShuffleText from "shuffle-text";

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

require("node_modules/jquery-inview/jquery.inview.js");

type langType = "ja" | "en";

let currentLang:langType = "ja";

function switchLang(lang: langType) {
   currentLang = lang;
   const counterLang = lang === "ja" ? "en" : "ja";
   $(`#language-control button[data-lang='${lang}']`).addClass("button-active");
   $(`#language-control button[data-lang='${counterLang}']`).removeClass("button-active");

   $('h1, h2, h3').each(function() {
      if ($(this).hasClass("active")) {
         const shuffleText = new ShuffleText(this);
         const output = $(this).attr(`data-${lang}-text`);
         shuffleText.setText("     " + output + "     ");
         shuffleText.start();
      }
   });

   // todo 重複の排除
   $('dt').each(function() {
      const output = $(this).attr(`data-${lang}-text`)
      if (output) {
         const shuffleText = new ShuffleText(this);
         shuffleText.setText(output);
         shuffleText.start();

      }
   });

   $('li, p, dd').each(function() {
      const output = $(this).attr(`data-${lang}-text`)
      if (output) {
         const shuffleText = new ShuffleText(this);
         shuffleText.setText(output);
         shuffleText.duration = 1000;
         shuffleText.start();

      }
   });
}

$(() => {

   $('h1, h2, h3').on('inview', function (event, isInView) {
      if (isInView && !$(this).hasClass("active")) {
            const shuffleText = new ShuffleText(this);
            const targetLang = currentLang;
            const output = $(this).attr(`data-${targetLang}-text`);

            if (output) {
               $(this).text("　").addClass("active");
               shuffleText.setText("     " + output + "     ");
               shuffleText.start();
            } else {
               throw Error(`Attribute "data-${targetLang}-text" is not defined`);
            }
      } else {
         // do nothing
      }
   });

   $("#language-control button").on("click", function() {
      if (!$(this).hasClass("button-active")) {
         const nextLang =  $(this).attr("data-lang");
         if (nextLang) {
            if (nextLang === "ja" || nextLang === "en") {
               switchLang(nextLang);
            } else {
               throw Error('Invalid value of "data-lang" attribute: ' + nextLang);
            }
         } else {
            throw Error('Attribute "data-lang" is not defined');
         }
      }
   })

});