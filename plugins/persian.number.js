
import persianJs from "persianjs";
var x = Number;

x.prototype.toPersianNumber = function () {
  return persianJs(this || "0")
    .englishNumber()
    .toString();
};
