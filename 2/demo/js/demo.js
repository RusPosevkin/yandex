var onload = function () {
    var firstNodeID = "#first";
    var secondNodeID = "#second";
    var thirdNodeID = "#third";

    var onClickClassList = function () {
        var getText = function (nodeID) {
            var classList = $fw(nodeID).getClassList()[0];
            var text = nodeID + ": ";
            for (var i = 0; i < classList.length; i++) {
                text += classList[i];

                if (i !== classList.length-1) {
                    text += " | " ;
                }
            }

            return text;
        };

        $fw(".first").text(getText(firstNodeID));
        $fw(".second").text(getText(secondNodeID));
        $fw(".third").text(getText(thirdNodeID));
    };

    var onClickMakeGreen = function () {
        var conditionFirst = $fw(firstNodeID).hasClass("circled");
        var conditionSecond = $fw(secondNodeID).hasClass("circled");
        var conditionThird = $fw(thirdNodeID).hasClass("circled");

        $fw(firstNodeID).toggleClass("green", conditionFirst);
        $fw(secondNodeID).toggleClass("green", conditionSecond);
        $fw(thirdNodeID).toggleClass("green", conditionThird);
    };

    var onClickToggleColor = function () {
        $fw(thirdNodeID).toggleClass("blue");
    };

    var onClickMakeCircle = function () {
        $fw(thirdNodeID).addClass("circled");
    };

    var onClickRemoveClass = function () {
        $fw(firstNodeID).removeClass(["rounded", "red"]);
    };

    document.querySelector("#btnGetClassList").addEventListener("click", onClickClassList);
    document.querySelector("#btnMakeGreen").addEventListener("click", onClickMakeGreen);
    document.querySelector("#btnToggleColor").addEventListener("click", onClickToggleColor);
    document.querySelector("#btnMakeCircle").addEventListener("click", onClickMakeCircle);
    document.querySelector("#btnRemoveClass").addEventListener("click", onClickRemoveClass);
}

document.addEventListener("load", onload);