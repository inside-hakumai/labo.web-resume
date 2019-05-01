import $ from "jquery";


export function isHalf(c: string){
   if (c.length !== 1) throw Error("Only a character must be supplied as the argument");

   return !c.match(/[^\x01-\x7E]/) || !c.match(/[^\uFF65-\uFF9F]/);
}

export function calcTextWidth(text: string, fullCharWidth = 16, halfCharWidth = 8) {
   let width = 0;

   for (let i = 0; i < text.length; i++) {
      const char = text[i];
      width += (!char.match(/[^\x01-\x7E]/) || !char.match(/[^\uFF65-\uFF9F]/)) ? halfCharWidth : fullCharWidth ;
   }

   return width;
}


/**
 * 与えられた値がnullかundefinedではないことを確約する
 * nullかundefinedな値が与えられた場合はエラーを発生させる
 * @param value チェック対象の値
 */
export function ensureNotUndefinedOrNull<T>(value: T) : NonNullable<T> {

   if (typeof value === 'undefined') throw new Error("undefined detected");
   if (value === null) throw new Error("null detected");

   return <NonNullable<T>> value; // todo タイプアサーションを使用せずにコンパイルを通したい
}


/**
 * 指定されたタグに付与されているCSSの環境下における，日本語文字と英語文字の文字の横幅をpx単位で返す
 * 等幅フォント環境での仕様を想定
 * @param targetTagSelector 文字の横幅の計算を行うタグを示すセレクタ文字列
 */
export function calcCharWidth(targetTagSelector: string | null = null): number[] {

   if (calcCharWidth.resultCache[targetTagSelector || "DEFAULT"]) {
      return calcCharWidth.resultCache[targetTagSelector || "DEFAULT"];
   }

   const targetDom = document.querySelector(targetTagSelector || "body");
   // console.debug(targetDom);
   if (!targetDom) throw new Error(`Any element specified by given selector was not found: ${targetTagSelector}`);

   const fontSizeStyle = window.getComputedStyle(targetDom, null).getPropertyValue("font-size");
   const fontFamilyStyle = window.getComputedStyle(targetDom, null).getPropertyValue("font-family");
   const fontSize = parseFloat(fontSizeStyle);

   const testerWrapperTag = targetTagSelector ? targetDom.tagName : "div";
   const testerJaWrapper = $(`<${testerWrapperTag} id="tester-ja" class="tester">あ</${testerWrapperTag}>`);
   const testerEnWrapper = $(`<${testerWrapperTag} id="tester-en" class="tester">a</${testerWrapperTag}>`);
   $('body').append(testerJaWrapper);
   $('body').append(testerEnWrapper);
   const jaTester = ensureNotUndefinedOrNull(document.getElementById("tester-ja"));
   jaTester.style.fontSize = fontSize.toString();
   jaTester.style.fontFamily = fontFamilyStyle;
   const jaCharacterWidth = jaTester.clientWidth;

   const enTester = ensureNotUndefinedOrNull(document.getElementById("tester-en"));
   enTester.style.fontSize = fontSize.toString();
   enTester.style.fontFamily = fontFamilyStyle;
   const enCharacterWidth = enTester.clientWidth;

   testerJaWrapper.remove();
   testerEnWrapper.remove();

   calcCharWidth.resultCache[targetTagSelector || "DEFAULT"] = [jaCharacterWidth, enCharacterWidth];
   // console.debug(`JP character width for ${targetTagSelector || "DEFAULT"}: ${jaCharacterWidth}`);
   // console.debug(`EN character width for ${targetTagSelector || "DEFAULT"}: ${enCharacterWidth}`);

   return [jaCharacterWidth, enCharacterWidth];
}
calcCharWidth.resultCache = {};


export function getCssSelector(element: HTMLElement) {

   if (!(element instanceof Element)) return;
   let path: string[] = [];
   while (element.parentNode && element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();

      if (element.id) {
         selector += '#' + element.id;
      } else if (element.previousElementSibling) {
         let currentNode: Element | null = element;
         let nth = 1;
         do {
            nth++;
            currentNode = currentNode.previousElementSibling;
         } while (currentNode && currentNode.previousElementSibling);

         selector += `:nth-child(${nth})`;
      }

      path.unshift(selector);
      element = <HTMLElement>element.parentNode;
   }
   return path.join(" > ");
}