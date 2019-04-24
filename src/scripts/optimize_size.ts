import 'jquery'
import $ from "jquery";
import {calcTextWidth, ensureNotUndefinedOrNull} from "./helpers";


/**
 * スクロールしていない状態で，名前を表示する枠が画面中央に配置され，スクロールを促す矢印が画面下部に配置されるように，
 * 名前を表示させる枠を含むwrapperのpaddingとheightの値を調整する
 */
function adjustBrandingWrapperMargin() {
   const innerHeight = window.innerHeight;
   $("#branding-wrapper")
      .css('padding-top', `${(innerHeight-200)/2}px`)
      .css('height', `${innerHeight}px`);
}


function adjustWrapperFrameSize() {
   $('.component-wrapper').each(function() {
      if (!$(this).hasClass('done-animation')) return;

      const titleDomWidth = ensureNotUndefinedOrNull($(this).outerWidth());
      const titleDomHeight = ensureNotUndefinedOrNull($(this).outerHeight());

      $(this).find('div.frame-fastspin, div.frame-slowspin').css('height', `${titleDomHeight - 10}px`);
   });
}

function adjustTextWidth() {
   const jaFontSize = Number.parseInt($('body').css('font-size').slice(0, -2));
   const enFontSize = jaFontSize / 2;
   $('span.line').each(function() {
      $(this).css('width',
         `${calcTextWidth($(this).text(), enFontSize, jaFontSize)}px`
      );
   });
}

let currentWindowWidth = 0;
let currentWindowHeight = 0;

$(() => {
   currentWindowWidth = ensureNotUndefinedOrNull($(window).width());
   currentWindowHeight = ensureNotUndefinedOrNull($(window).width());
   adjustBrandingWrapperMargin();
});

window.addEventListener('resize', () => {
   const newWindowWidth = ensureNotUndefinedOrNull($(window).width());
   const newWindowHeight = ensureNotUndefinedOrNull($(window).width());

   if (newWindowWidth !== currentWindowWidth) {
      currentWindowWidth = newWindowWidth;
      window.dispatchEvent(new Event("resizeHorizontally"));
   }

   if (newWindowHeight !== currentWindowHeight) {
      currentWindowHeight = newWindowHeight;
      window.dispatchEvent(new Event("resizeVertically"));
   }
});

window.addEventListener('resize', adjustBrandingWrapperMargin);
window.addEventListener('resizeHorizontally', adjustWrapperFrameSize);
window.addEventListener('resizeHorizontally', adjustTextWidth);
