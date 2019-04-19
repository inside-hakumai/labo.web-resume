import $ from "jquery";
import ShuffleText from "shuffle-text";

import anime from 'animejs';

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

function appearWithShuffleEffect(targetDom: HTMLElement) {
   if ($(targetDom).hasClass("active")) return ;

   const shuffleText = new ShuffleText(targetDom);
   const targetLang = currentLang;
   const output = $(targetDom).attr(`data-${targetLang}-text`);

   if (output) {
      $(targetDom).text("　").addClass("active");
      shuffleText.setText("     " + output + "     ");
      shuffleText.start();
   } else {
      throw Error(`Attribute "data-${targetLang}-text" is not defined`);
   }
}

$(() => {

   $('.component-wrapper').prepend('<div class="frame-fastspin"></div><div class="frame-slowspin"></div>');

   $('h2, h3').on('inview', function (event, isInView) {
      if (isInView) {
         appearWithShuffleEffect(this);
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
   });

   anime.timeline({})
      .add({
         targets: 'section.animated div.frame-fastspin',
         rotate: 720,
         duration: 4000,
         easing: 'linear',
      }, 0)
      .add({
         targets: 'section.animated div.frame-slowspin',
         rotate: 360,
         duration: 4000,
         easing: 'linear',
         changeComplete: function(anim) {
            setTimeout(() => {
               appearWithShuffleEffect($('h1')[0]);
            }, 250);
         }
      }, 0)
      .add({
         targets: 'section.animated div.frame-fastspin',
         width: 590,
         height: 190,
         right: '9px',
         bottom: '9px',
         duration: 500,
         easing: 'easeOutQuint'
      }, 4000)
      .add({
         targets: 'section.animated div.frame-slowspin',
         width: 590,
         height: 190,
         top: '8px',
         left: '8px',
         margin: 'auto',
         duration: 500,
         easing: 'easeOutQuint'
      }, 4100);


});