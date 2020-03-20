/**
 * The function positions a new div to exactly the bounding client rect without
 * using sticky position. If it's directly under the sticky element it could be
 * obscured and not show up when compared to the ref.  */
function createIndicatorElements(sticky_divs) {
  sticky_divs.forEach((sticky_div) => {
    var new_div = document.createElement("div");
    //assert_true(getComputedStyle(sticky_div).position="absolute",
    // 'sticky_div should have position sticky');
    new_div.style.left = sticky_div.offsetLeft+"px";
    new_div.style.top  = sticky_div.offsetTop+"px";
    new_div.style.position = "relative"
    var new_div_child = document.createElement("div");
    new_div_child.style.width = sticky_div.offsetWidth+"px";
    new_div_child.style.height = sticky_div.offsetHeight+"px";
    new_div_child.innerHTML = "XXX"
    new_div_child.style.color = 'blue';
    new_div_child.style.position = "absolute";
    new_div.appendChild(new_div_child);
    sticky_div.parentNode.insertBefore(new_div, sticky_div);
  });
  return document;
}
