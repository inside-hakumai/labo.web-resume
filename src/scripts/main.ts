import $ from "jquery";
import ShuffleText from "shuffle-text";

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
UIkit.use(Icons);

require("node_modules/jquery-inview/jquery.inview.js");

$(() => {

   $('h1, h2').on('inview', function (event, isInView) {
      if (isInView && !$(this).hasClass("active")) {
            const shuffleText = new ShuffleText(this);
            const output = $(this).attr("data-ja-text");

            if (output) {
               $(this).text("　").addClass("active");
               shuffleText.setText("     " + output + "     ");
               shuffleText.start();
            } else {
               throw Error('Attribute "data-ja-text" is not defined');
            }
      } else {
         // do nothing
      }
   });

});