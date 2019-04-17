import $ from "jquery";
// import ShuffleText from "shuffle-text";

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

require("node_modules/jquery-inview/jquery.inview.js");


interface Window {
   jQuery: JQueryStatic;
}
declare var window: Window;
window.jQuery = $;


$(() => {

   $('h1').on('inview', function (event, isInView) {
      if (isInView) {
         $(this).shuffleLetters();
      } else {
         console.log("out");
      }
   });


});