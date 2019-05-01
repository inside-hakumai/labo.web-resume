import $ from "jquery";

import ShuffleText from "shuffle-text";

// @ts-ignore
window.$ = $;
// @ts-ignore
window.ShufffleText = ShuffleText;

import anime from 'animejs';

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

require("node_modules/jquery-inview/jquery.inview.js");

import "./optimize_size";
import {isHalf, ensureNotUndefinedOrNull, calcTextWidth, calcCharWidth, getCssSelector} from './helpers';

type langType = "ja" | "en";

let currentLang:langType = "ja";

let timeOnReady: number | null = null;
let timeOnLoad:  number | null = null;

let jaCharacterWidth: number | null = null;
let enCharacterWidth: number | null = null;

function decodeTextAndWrapInBlockSpan(langType: langType) {
   /**
    * HTML内に含まれるテキストノードを半角スペースで分割し， <span class="line"></span> でラップする
    */　// todo インデントが深すぎる，処理が見づらい
   const textParentNodes = $(`*[data-${langType}-text], *[data-text]`);
   console.debug(textParentNodes);
   for (let i = 0; i < textParentNodes.length; i++) {
      const node = textParentNodes[i];

      const terms = $(node).data(`${langType}-text`) || $(node).data("text");
      const unescapedTerms = terms.map(unescape); // todo unescape()はdeprecated

      const newWrapperNode = document.createElement('span');

      for (let k = 0; k < unescapedTerms.length; k++) {
         const term = unescapedTerms[k];
         // console.debug(term);

         if (node.tagName !== "H1" && node.tagName !== "H2" && node.tagName !== "H3") {
            const termWidth = calcTextWidth(term,...calcCharWidth(getCssSelector(node)));
            newWrapperNode.appendChild($(`<span class="line" style="width: ${termWidth}px">${term}</span>`).get(0));
         } else {
            newWrapperNode.appendChild($(`<span class="line">${term}</span>`).get(0));
         }
      }

      $(node).empty();
      node.append(newWrapperNode);
   }
}

function switchLang(langType: langType) {
   currentLang = langType;
   const counterLang = langType === "ja" ? "en" : "ja";
   $(`#language-control button[data-lang='${langType}']`).addClass("button-active");
   $(`#language-control button[data-lang='${counterLang}']`).removeClass("button-active");

   decodeTextAndWrapInBlockSpan(langType);

   $(`*[data-${langType}-text], *[data-text]`).each(function() {
      if ($(this).hasClass("active")) {
         $(this).find("span.line").each(function () {
            const shuffleText = new ShuffleText(this);
            // const output = $(this).attr(`data-${lang}-text`);
            const output = $(this).text();
            shuffleText.setText(output || "");
            shuffleText.start();
         });
      }
   });

   // todo 重複の排除
   // $('dt').each(function() {
   //    const output = $(this).attr(`data-${lang}-text`)
   //    if (output) {
   //       const shuffleText = new ShuffleText(this);
   //       shuffleText.setText(output);
   //       shuffleText.duration = 400;
   //       shuffleText.start();
   //
   //    }
   // });
   //
   // $('li, p, dd').each(function() {
   //    const output = $(this).attr(`data-${lang}-text`)
   //    if (output) {
   //       const shuffleText = new ShuffleText(this);
   //       shuffleText.setText(output);
   //       shuffleText.duration = 800;
   //       shuffleText.start();
   //
   //    }
   // });
}

async function appear(targetDom: HTMLElement): Promise<void> {
   if ($(targetDom).hasClass("active")) return;
   $(targetDom).addClass("active");
}

async function appearWithShuffleEffect(targetDom: HTMLElement): Promise<void> {

   return new Promise<void>(((resolve, reject) => {
      if ($(targetDom).hasClass("active")) resolve();

      const shuffleText = new ShuffleText(targetDom);
      const targetLang = currentLang;
      const output = $(targetDom).text();

      if (output) {
         $(targetDom).addClass("active");
         shuffleText.setText(output);
         shuffleText.duration = targetDom.tagName === "H2" ? 400 : 800;
         shuffleText.start();
         setTimeout(resolve, shuffleText.duration);
      } else {
         reject(`Attribute "data-${targetLang}-text" is not defined`);
      }
   }));
}

async function spin(wrapperDom: HTMLElement, duration:number = 2000): Promise<void> {

   if (!$(wrapperDom).hasClass('component-wrapper') || !$(wrapperDom).attr('id')) {
      throw Error('Animation target node must have id and "component-wrapper" class');
   }

   const wrapperDomId = $(wrapperDom).attr('id');

   return new Promise<void>((resolve => {
      anime.timeline({})
         .add({
            targets: `#${wrapperDomId} div.frame-fastspin`,
            rotate: [0, 360*duration/2000],
            duration: duration,
            easing: 'linear',
         }, 0)
         .add({
            targets: `#${wrapperDomId} div.frame-slowspin`,
            rotate: [0, 180*duration/2000],
            duration: duration,
            easing: 'linear',
            changeComplete: () => {
               $(`#${wrapperDomId} div.frame-fastspin`).css('transform', 'rotate(0deg)');
               $(`#${wrapperDomId} div.frame-slowspin`).css('transform', 'rotate(0deg)');
               console.debug(`Complete frame spin of `, wrapperDom, `. 'load' event => ${isAlreadyLoaded}`);
               resolve();
            }
         }, 0)
   }));
}


async function executeAppearingAnimation(wrapperDom: HTMLElement) {

   if ($(wrapperDom).hasClass('on-animation') || $(wrapperDom).hasClass('done-animation')) return;

   if (!$(wrapperDom).hasClass('component-wrapper') || !$(wrapperDom).attr('id')) {
      throw Error('Animation target node must have id and "component-wrapper" class');
   }

   const wrapperDomId = $(wrapperDom).attr('id');

   const wrapperDomWidth  = ensureNotUndefinedOrNull($(wrapperDom).outerWidth());
   const wrapperDomHeight = ensureNotUndefinedOrNull($(wrapperDom).outerHeight());

   $(wrapperDom).addClass('on-animation');

   await spin(wrapperDom, 1000);

   $(wrapperDom).addClass('active');

   return Promise.all(
      [
         new Promise(resolve => {
            anime.timeline({})
               .add({
                  targets: `#${wrapperDomId} div.frame-fastspin`,
                  width: wrapperDomWidth - 10,
                  height: wrapperDomHeight - 10,
                  right: '9px',
                  bottom: '9px',
                  duration: 500,
                  easing: 'easeOutQuint'
               }, 0)
               .add({
                  targets: `#${wrapperDomId} div.frame-slowspin`,
                  width: wrapperDomWidth - 10,
                  height: wrapperDomHeight - 10,
                  top: '8px',
                  left: '8px',
                  margin: 'auto',
                  duration: 500,
                  easing: 'easeOutQuint',
                  changeComplete: () => {
                     $(`#${wrapperDomId} div.frame-fastspin, #${wrapperDomId} div.frame-slowspin`)
                        .css('width', 'calc(100% - 10px');
                     resolve();
                  }
               }, 100)
         }),
         new Promise(resolve => {
            // DOM上の，子にテキストノードを含むようなノードに対してはShuffleTextを適用
            // 含まないようなノードに対しては単に visibility の値を visible に変更するだけ
            let effectPromises: Promise<any>[] = [];
            let nodes = $(`#${wrapperDomId}`).find("h1, h2, h3, p, dt, dd, li, span");
            for (let i = 0; i < nodes.length; i++) {
               const childNodes = $(nodes[i]).contents();

               // 注目ノードのchildrenにテキストノードが含まれているかどうかを，childをひとつずつ見ることで確認
               // ただし，テキストノードにはそのノードが持っているテキストが "\n" のように改行コードしか含まれていないようなノードが
               // 大量に存在するのでそれは無視する
               for (let k = 0; k < childNodes.length; k++) {
                  // 種類がテキストノードでかつ，改行コードや空白を除いたテキスト長が0で無い場合（何かしらの自然言語を含んでいる場合）
                  const childNodeText = childNodes[k].textContent;
                  if (childNodes[k].nodeType === Node.TEXT_NODE && childNodeText !== null && childNodeText.trim().length !== 0) {
                     // console.debug(childNodes);
                     effectPromises.push(appearWithShuffleEffect(nodes[i]));
                     break;
                  }

                  // 注目ノードのchildrenをすべて確認した結果，テキストノードが含まれていなかった場合
                  if (k === childNodes.length - 1) {
                     effectPromises.push(appear(nodes[i]));
                     break;
                  }
               }
            }

            setTimeout(() => {
               return Promise.all(effectPromises)
               .then(() => {
                  $(wrapperDom).removeClass('on-animation');
                  $(wrapperDom).addClass('done-animation');
                  resolve()
               })
            }, 250);
         })
      ]);
}

async function executeTitleComponentAnimation() {

   do {
      await spin(ensureNotUndefinedOrNull(document.getElementById("title-wrapper")));
   } while (!isAlreadyLoaded);

   const titleDomWidth = ensureNotUndefinedOrNull($("#title-wrapper").outerWidth());
   const titleDomHeight = ensureNotUndefinedOrNull($("#title-wrapper").outerHeight());

   $('#title-wrapper').addClass('active');

   return Promise.all(
      [
         new Promise(resolve => {
            anime.timeline({})
               .add({
                  targets: `#title-wrapper div.frame-fastspin`,
                  width: titleDomWidth - 10,
                  height: titleDomHeight - 10,
                  right: '8px',
                  bottom: '8px',
                  duration: 500,
                  easing: 'easeOutQuint'
               }, 0)
               .add({
                  targets: `#title-wrapper div.frame-slowspin`,
                  width: titleDomWidth - 10,
                  height: titleDomHeight - 10,
                  top: '8px',
                  left: '8px',
                  margin: 'auto',
                  duration: 500,
                  easing: 'easeOutQuint',
                  changeComplete: () => {
                     $(`#title-wrapper div.frame-fastspin, #title-wrapper div.frame-slowspin`)
                        .css('width', 'calc(100% - 10px');
                     resolve();
                  }
               }, 100)
            }),
         new Promise(resolve => {
            setTimeout(() => {
               appearWithShuffleEffect($("#title-wrapper h1")[0]).then(() => {resolve()});
               }, 250);
         })
      ]);
}

$(async () => {
   timeOnReady = performance.now();
   console.debug(`Time to "ready" event from opening the page: ${timeOnReady.toFixed(0)} ms`);

   $('.component-wrapper').prepend('<div class="frame-fastspin"></div><div class="frame-slowspin"></div>');


   await executeTitleComponentAnimation();

   $('.component-wrapper:not(#title-wrapper)').on('inview', function (event, isInView) {
      if (isInView) {
         executeAppearingAnimation(this);
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

});


let isAlreadyLoaded = false;
$(window).on('load', async function() {
   isAlreadyLoaded = true;

   decodeTextAndWrapInBlockSpan("ja");

   $('header, #grid, #scroll-down').addClass('active');

   timeOnLoad = performance.now();
   const timeOnLoadFromReady = timeOnLoad - (timeOnReady || 0);
   console.debug(`Time to "load"  event from opening the page: ${timeOnLoad.toFixed(0)} ms (${timeOnLoadFromReady.toFixed(0)} ms from "ready" event)` );
});
