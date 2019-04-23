export function isHalf(c: string){
   if (c.length !== 1) throw Error("Only a character must be supplied as the argument");

   return !c.match(/[^\x01-\x7E]/) || !c.match(/[^\uFF65-\uFF9F]/);
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