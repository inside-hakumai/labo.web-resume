


export function isHalf(c: string){
   if (c.length !== 1) throw Error("Only a character must be supplied as the argument");

   return !c.match(/[^\x01-\x7E]/) || !c.match(/[^\uFF65-\uFF9F]/);
}

export function calcTextWidth(text: string, halfCharWidth = 8, fullCharWidth = 16) {
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