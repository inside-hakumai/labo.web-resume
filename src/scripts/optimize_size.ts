import 'jquery'


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

$(adjustBrandingWrapperMargin);
$(window).on('resize', adjustBrandingWrapperMargin);
