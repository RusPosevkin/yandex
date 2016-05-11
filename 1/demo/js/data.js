// Madrid - Barcelona - Gerona Airport - Stockholm - New York JFK
var defaultData = [
    {
        departure: "Stockholm",
        destination: "New York JFK",
        transport: {
            type: "plane",
            route: "SK22",
            seat: "7B",
            gate: "22",
            baggage_drop: {
                required: false
            }
        }
    },
    {
        departure: "Barcelona",
        destination: "Gerona Airport",
        transport: {
            type: "bus",
            route: "airport",
            seat: false
        }
    },
    {
        departure: "Gerona Airport",
        destination: "Stockholm",
        transport: {
            type: "plane",
            route: "SK455",
            seat: "3A",
            gate: "45B",
            baggage_drop: {
                required: true,
                value: "344"
            }
        }
    },
    {
        departure: "Madrid",
        destination: "Barcelona",
        transport: {
            type: "train",
            route: "78A",
            seat: "45B"
        }
    }
];

// Gerona - Barcelona - Madrid - Barcelona - Munich
var dataWithCenterLoop = [
    {
        departure: "Barcelona",
        destination: "Munich",
        transport: {
            type: "train",
            route: "78A",
            seat: "12"
        }
    },
    {
        departure: "Barcelona",
        destination: "Madrid",
        transport: {
            type: "taxi",
            info: "White Kia Rio"
        }
    },
    {
        departure: "Madrid",
        destination: "Barcelona",
        transport: {
            type: "taxi",
            info: "Green Hummer H2"
        }
    },
    {
        departure: "Gerona",
        destination: "Barcelona",
        transport: {
            type: "plane",
            route: "SK22",
            seat: "7B",
            gate: "22",
            baggage_drop: {
                required: true,
                value: "125"
            }
        }
    }
];

// A - B - C - D - E - B
var dataWithFinishLoop = [
    {
        departure: "B",
        destination: "C"
    },
    {
        departure: "E",
        destination: "B"
    },
    {
        departure: "C",
        destination: "D"
    },
    {
        departure: "A",
        destination: "B"
    },
    {
        departure: "D",
        destination: "E"
    }
];

// A - B - C - D - A - E
var dataWithStartLoop = [
    {
        departure: "B",
        destination: "C"
    },
    {
        departure: "A",
        destination: "B"
    },
    {
        departure: "A",
        destination: "E"
    },
    {
        departure: "D",
        destination: "A"
    },
    {
        departure: "C",
        destination: "D"
    }
];

// A - B - C - D - A
var loopedData = [
    {
        departure: "D",
        destination: "A"
    },
    {
        departure: "B",
        destination: "C"
    },
    {
        departure: "C",
        destination: "D"
    },
    {
        departure: "A",
        destination: "B"
    }
];

// Incorrect
// Incorrect data format. Needs an array.
incorrectDataFormat = {
    departureFirst: "A",
    destinationFirst: "B",
    departureSecond: "C",
    destinationSecond: "D",
    departure: "B",
    destination: "C"
};

// Incorrect
// 'Departure' and 'destination' fields are mandatory.
var omittedPoint = [
    {
        departure: "A",
        destination: "B"
    },
    {
        departure: "B"
    },
    {
        departure: "B",
        destination: "C"
    }
];

// Incorrect
// 'Departure' and 'destination' fields data can't be the same.
var samePointsData = [
    {
        departure: "A",
        destination: "A"
    },
    {
        departure: "B",
        destination: "C"
    },
    {
        departure: "A",
        destination: "B"
    }
];

// Incorrect
// These cards don't make a chain.
// A - B | C - D - E | F - G
var notChainData = [
    {
        departure: "A",
        destination: "B"
    },
    {
        departure: "C",
        destination: "D"
    },
    {
        departure: "D",
        destination: "E"
    },
    {
        departure: "F",
        destination: "G"
    }
];