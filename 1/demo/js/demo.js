var onload = function () {
    var data = {
        defaultData: defaultData,
        dataWithCenterLoop: dataWithCenterLoop,
        dataWithFinishLoop: dataWithFinishLoop,
        dataWithStartLoop: dataWithStartLoop,
        loopedData: loopedData,
        incorrectDataFormat: incorrectDataFormat,
        omittedPoint: omittedPoint,
        samePointsData: samePointsData,
        notChainData: notChainData
    };

    var onChangeSelect = function (event) {
        var sourceNode = document.querySelector('.source');
        var sortedNode = document.querySelector('.sorted');
        var errorsNode = document.querySelector('.errors');

        sourceNode.innerHTML = "";
        sortedNode.innerHTML = "";
        errorsNode.innerHTML = "";

        try {
            var tcs = new TravelCardsSorter(data[this.value]);
            sourceNode.innerHTML = tcs.printRoute();
            tcs.sort();
            sortedNode.innerHTML = tcs.printRoute();
            delete tcs;
        } catch (e) {
            errorsNode.innerHTML = e;
        }
    };

    document.querySelector('#cards').addEventListener('change', onChangeSelect);
}

document.addEventListener('load', onload);