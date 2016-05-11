"use strict";
/**
 * @author Ruslan Posevkin
 */

/**
 * Create a new travel cards sorter.
 * @constructor
 * @param {Object[]} data - Set of travel cards.
 */
function TravelCardsSorter(data) {
    this.data = [];
    this.points = {};

    this.warningMessages = {
        loopedChain: "Warning: these cards make a looped chain. Start and finish points may be incorrect."
    };

    this.errorMessages = {
        incorrectFormat: "Incorrect data format. Needs an array.",
        omittedPoint: "'Departure' and 'destination' fields are mandatory.",
        samePoints: "'Departure' and 'destination' fields data can't be the same.",
        notChain: "These cards don't make a chain."
    };

    // Common templates for concrete transport type
    this.transportTemplates = {
        train: "Take train {{route}} from {{departure}} to {{destination}}. {{seat}}.",
        bus: "Take {{route}} bus from {{departure}} to {{destination}}. {{seat}}.",
        plane: "From {{departure}}, take flight {{route}} to {{destination}}. Gate {{gate}}. {{seat}}. {{baggage_drop}}",
        taxi: "Take taxi from {{departure}} to {{destination}}. {{info}}.",
        standart: "From {{departure}} to {{destination}}."
    };

    // Other templates
    this.templates = {
        baggage_drop: {
            auto: "Baggage will be automatically transferred from your last leg.",
            value: "Baggage drop at ticket counter {{value}}."
        },
        seat: {
            auto: "No seat assignment",
            value: "Seat {{value}}"
        }
    };

    if (data) {
        this.importData(data);
    }
}

/**
 * Import travel cards.
 * @param {Object[]} data - Set of travel cards.
 * @returns {Number} Count of imported cards.
 * @throws Will throw an error if the argument is not an array.
 * @throws Will throw an error if 'departure' or 'destination' fields are omitted.
 * @throws Will throw an error if 'departure' or 'destination' fields are the same.
 */
TravelCardsSorter.prototype.importData = function (data) {
    if (!(data instanceof Array)) {
        throw new Error(this.errorMessages.incorrectFormat);
    }

    // clone set of cards
    data.forEach(function (card) {
        var item = {};

        for (var key in card) {
            item[key] = card[key];
        }

        if (!(("departure" in card) && ("destination" in card))) {
            throw new Error(this.errorMessages.omittedPoint);
        }

        if (card.departure === card.destination) {
            throw new Error(this.errorMessages.samePoints);
        }

        this.data.push(item);
    }, this);

    return this.data.length;
};

/**
 * Create hash table:
 * key - departure/destination point,
 * value - object, where:
 * value.departure - how much point include in cards as a departure.
 * value.destination - how much point included in cards as a destination.
 */
TravelCardsSorter.prototype.createHashTable = function () {
    var self = this;

    var countPoint = function (key, type) {
        // init point if it doesn't exist
        if (!self.points[key]) {
            self.points[key] = {
                departure: 0,
                destination: 0
            }
        }

        self.points[key][type]++;
    };

    this.data.forEach(function (card) {
        countPoint(card.departure, "departure");
        countPoint(card.destination, "destination");
    });
};

/**
 * Find first and last points of travel chain.
 * @returns {Object} First and last points.
 * @throws Will throw an error if cards don't make a chain.
 */
TravelCardsSorter.prototype.getEndPoints = function () {
    var endPointsCounter = 0;
    var endPoints = {};

    for (var key in this.points) {
        var departure = this.points[key].departure;
        var destination = this.points[key].destination;

        if (departure > destination) {
            endPoints.first = key;
            endPointsCounter++;
        } else if (departure < destination) {
            endPoints.last = key;
            endPointsCounter++;
        }
    }

    if (endPointsCounter !== 2) {
        if (endPointsCounter === 0) {
            // Start and finish points can't be detect correctly in looped chain
            console.log(this.warningMessages.loopedChain);

            // But it is indissoluble chain.
            // So get the first value
            for (var key in this.points) {
                endPoints = {
                    first: key,
                    last: key
                };

                break;
            }
        } else {
            throw new Error(this.errorMessages.notChain);
        }
    }

    return endPoints;
};

/**
 * Sort travel cards and make chain from them.
 * @param {Object} endPoints - First and last points.
 */
TravelCardsSorter.prototype.makeChain = function (endPoints) {
    var self = this;

    // Count of travel cards
    var chainLength = this.data.length;
    var departure = endPoints.first;

    // Counter of travel cards included in sorted chain
    var chainLengthCounter = 0;

    // Sorted travel cards
    this.sortedData = [];

    /**
     * Get travel cards with routes from this departure point.
     * @param {String} departure - Departure point.
     * @returns {Object[]} Set of routes from this point.
     */
    var getCardsByDeparture = function (departure) {
        return self.data.filter(function (card) {
            return card.departure === departure;
        });
    };

    // Eventual versions of routes
    this.back = [];

    // While next point of route is obvious and one-valued
    // travel cards include in this.sortedData.

    // If we have multiple-valued version of next point
    // we start create following parts of route chain using this.back.
    while(chainLengthCounter < chainLength) {
        var result = getCardsByDeparture(departure);

        if (result.length === 0) {
            // When we get last point of chain it is need to be verified
            // that count of imported travel cards equal length of route chain
            if ((chainLengthCounter + this.back.length === chainLength) &&
                (departure === endPoints.last)) {

                // If it so, extract data from this.back.
                this.back.forEach(function (item) {
                    this.sortedData.push(item.data[item.index]);
                }, this);

                return;
            } else {
                // Incorrect route chain.
                // Come back to previous multiple-valued point
                // and choose alternate route
                for (var i = this.back.length-1; i === 0; i--) {
                    // Find previous multiple-valued point
                    if (this.back[i].data.length !== 0) {
                        if (this.back[i].index++ < this.back[i].data.length) {
                            // Choose alternate route
                            departure = this.back[i].data[this.back[i].index].destination;
                            break;
                        } else {
                            // If we try all available routes from this point
                            // then delete this point and come back.
                            this.back.pop();
                        }
                    } else {
                        // If it is one-valued point then just delete it
                        // and come back to multiple-valued point.
                        this.back.pop();
                    }
                }
            }
        } else if (result.length === 1) {
            // It is one-valued point ...
            if (this.back.length === 0) {
                // and all previous points are also one-valued.
                // So just push to sortedData.
                this.sortedData.push(result[0]);
                departure = result[0].destination;
                chainLengthCounter++;
            } else {
                // and it is exists multiple-valued points before it,
                // push to multiple-valued data storage this.sortedData
                this.back.push({
                    point: departure,
                    data: result,
                    index: 0
                });

                departure = result[0].destination;
            }
        } else {
            // It is multiple-valued point.
            var conditionData = this.back.filter(function (item) {
                return item.point === departure;
            });

            // Verify that we use route from this point which don't be used earlier.
            if (conditionData.length === 0) {
                this.back.push({
                    point: departure,
                    data: result,
                    index: 0
                });
                departure = result[0].destination;
            } else {
                // Find alternate route that don't be used earlier.
                var conditionIndexes = conditionData.map(function (item) {
                    return item.index;
                });

                var departureArrayLength = conditionData[0].data.length;
                var index;

                for (index = 0; index < departureArrayLength; index++) {
                    if (conditionIndexes.indexOf(index) === -1) break;
                }

                this.back.push({
                    point: departure,
                    data: result,
                    index: index
                });

                departure = result[index].destination;
            }
        }
    }
};

/**
 * Sort travel cards.
 * If was imported more than one travel card
 * sorted travel chain can be available in this.sortedChain
 */
TravelCardsSorter.prototype.sort = function () {
    if (this.data.length < 2) return;

    this.createHashTable();
    this.makeChain(this.getEndPoints());
};

/**
 * Print travel route description.
 * @returns {String} HTML layout with description of travel route.
 */
TravelCardsSorter.prototype.printRoute = function () {
    var self = this;
    var data = this.sortedData || this.data;
    var routes = [];

    /**
     * Replace variables in template with data.
     * @param {String} text - Template.
     * @param {Object} replacements - Data for replacements.
     * @returns {String} Template with inserted data.
     */
    var insertData = function (text, replacements) {
        replacements.forEach(function (item) {
            text = text.replace("{{" + item.variable + "}}", item.text);
        });

        return text;
    };

    data.forEach(function (item) {
        var result;
        var replacements = [];
        var transport = item.transport;
        var baggageDrop = "baggage_drop";

        /**
         * Choose data for template by condition.
         * @param {Boolean} condition
         * @param {String} field - Field used to extract data from templates object.
         * @param {Boolean} isNested - Is data nested to templates object.
         */
        var getConditionTemplate = function (condition, field, isNested) {
            var value = condition ? "value" : "auto";
            var text = self.templates[field][value];

            replacements.push({ variable: field, text: text });

            if (value === "value") {
                var data = isNested ? transport[field][value] : transport[field];
                replacements.push({ variable: value, text: data });
            }
        };

        // If there is data about transport for this route.
        if (transport && ("type" in transport)) {
            // Choose template by transport type
            result = this.transportTemplates[transport.type];

            // And extract addtional information
            // specific for concrete transport type
            for (var key in transport) {
                switch (key) {
                    case "type":
                        continue;

                    case "seat":
                        getConditionTemplate(transport.seat, "seat", false);
                        break;

                    case baggageDrop:
                        getConditionTemplate(transport[baggageDrop].required, baggageDrop, true);
                        break;

                    default:
                        replacements.push({ variable: key, text: transport[key]});
                }
            }
        } else {
            // Choose default template if there is no data about transport
            result = this.transportTemplates["standart"];
        }

        replacements.push({ variable: "destination", text: item.destination });
        replacements.push({ variable: "departure", text: item.departure });

        // Get templates with inserted data about routes
        result = insertData(result, replacements);
        routes.push(result);
    }, this);

    // create html layout for all travel route chain
    var route = "<ul>";
    routes.forEach(function (item) {
        route += "<li>" + item + "</li>";
    });
    route += "</ul>";

    return route;
};