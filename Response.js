var exports = module.exports = {};

const coffees = [
    {
        name: "latte",
        offers: [],
        price: 11.25
    },
    {
        name: "filter coffee",
        offers: [],
        price: 11.25
    },
    {
        name: "cold brew",
        offers: [],
        price: 11.25
    },
    {
        name: "americano",
        offers: [],
        price: 11.25
    },
    {
        name: "cappucino",
        offers: [],
        price: 11.25
    },
    {
        name: "doppio",
        offers: [],
        price: 11.25
    },
    {
        name: "espresso macchiato",
        offers: [],
        price: 11.25
    },
    {
        name: "flat white",
        offers: [],
        price: 11.25
    }

];

const requests = [
    "i want to take",
    "i would like to take",
    "i want to drink",
    "can i take",
    "could i take",
]

const sizes = [
    {
        name: "tall",
        price: 0
    },
    {
        name: "grande",
        price: 1
    },
    {
        name: "venti",
        price: 2
    }
];

const hellos = [
    "good morning",
    "good evening",
    "good afternoon",
    "good night",
    "hello",
    "hi",
];

const lists = [
    "what kind of coffee do you have",
    "show me the list",
    "show me list",
    "show list",
    "show menu",
    "see the menu",
    "see menu",
    "see list",
    "see the list",
    "show me the menu",
    "show me menu",
    "get menu",
];

const counts = ["a", "two", "three", "four", "five", "six", "seven", "eight", "nine"];


const standardAnswers = [
    [["how are you", "what's up", "how is it going"], ["fine", "good", "ok"], ["bad", "sad"], ["thank you"], ["have a nice day", "bye", "take care yourself", "good bye"]],
    [["I am fine. Thank you for asking. What about you?", "I'm ok. What about you?"], ["I'm glad to hear that!"], ["I'm sorry to hear that :( How can i help you?"], ["You are welcome :)"], ["Have a nice day :)", "Good bye!", "Bye bye!"]]
];

let oldCoffee = "";
let oldSize = "";
let oldCount = "";
let oldRequestedCoffees = [];
let missedSize = false;

function reset() {
    oldSize = "";
    oldCoffee = "";
    oldCount = "";
    oldRequestedCoffees = [];
    missedSize = false
}

function capitalize(word) {
    return word.split("").map((letter, index) => !index ? letter.toUpperCase() : letter).join("");
}

class Suggestion {
    constructor(request) {
        let {message} = request;
        message = message.toLowerCase();
        this.request = request;
        const splittedMessage = message.split(" ");
        const lastWord = splittedMessage[splittedMessage.length - 1];

        return {
            author: "chatbot",
            message: lastWord ? [...coffees.map(i => i.name), ...sizes.map(i => i.name), ...lists, ...counts, ...requests, ...hellos, ...standardAnswers[0].join(",").split(",")].map(i => {
                if (i.indexOf(lastWord) === 0 || i.indexOf(message) === 0) {
                    return i
                } else {
                    return ""
                }
            }).filter(i => i) : [],
            suggest: true,
            date: new Date()
        }
    }
}

class Response {

    constructor(request) {
        let {message} = request;
        message = message.toLowerCase();
        this.request = request;
        this.response = {};

        const init = message === "init-chatbot";

        if (init) reset();

        console.log("RESPONSE", message);

        this.response.author = "chatbot";
        this.response.list = this.prepareList(message);
        this.response.message = init ?
            "Hello, welcome to CoffeeInLove. What do you desire?" :
            missedSize ? this.fixMissedSize(message) :
                this.parseRequest(message);
        this.response.date = new Date();

        if (!this.response.message && !this.response.list.length) {
            this.response.message = "Excuse me. I did not understand what you want. Could you try again?"
        }

        return init ? [this.response] : [request, this.response];
    }

    fixMissedSize(size) {
        if (sizes.map(i => i.name).filter(i => i === size).length) {
            oldRequestedCoffees.filter(i => !i.size && i.coffee)[0].size = size;
            return this.prepareResponse();
        } else {
            this.response.list = sizes.map(i => i.name);
            return "Please select a exists coffee size";
        }

    }

    parseRequest(request) {
        return this.prepareHello(request);
    }

    prepareHello(request) {
        let selectedHello = "";
        hellos.forEach(hello => {
            const helloRegex = new RegExp('.*' + hello + ".*");
            const isHelloSelected = request.toLowerCase().match(helloRegex);

            if (isHelloSelected) {
                selectedHello = capitalize(hello) + ". ";
            }
        });
        return selectedHello + this.prepareStandardAnswers(request);
    }

    prepareStandardAnswers(request) {
        let standardAnswer = "";

        standardAnswers[0].forEach((requests, index) => {
            const responses = standardAnswers[1][index];
            const requestRegex = "(" + requests.join("|") + ")";
            const match = request.toLowerCase().match(requestRegex);
            if (match) {
                const answerIndex = parseInt(Math.random() * (responses.length));
                standardAnswer = responses[answerIndex];
            }
        });

        return standardAnswer + this.findRequest(request)
    }

    prepareList(request) {
        let showList = false;
        lists.forEach(list => {
            const listRegex = new RegExp(list);
            const selectedList = request.toLowerCase().match(listRegex);
            if (!showList && selectedList) {
                showList = true
            }
        });
        return showList ? coffees.map(coffee => capitalize(coffee.name)) : [];

    }

    findRequest(_request) {
        let request = _request + "";
        const sizeRegex = "(" + sizes.map(i => i.name).join("|") + ")";
        const countsRegex = "(" + counts.join("|") + "|[0-9])";
        const coffeesRegex = "(" + coffees.map(i => i.name).join("|") + ")";
        const requestedCoffees = [];


        let coffeeRegex = [
            new RegExp(countsRegex + " " + sizeRegex + " " + coffeesRegex),
            new RegExp(countsRegex + " " + coffeesRegex),

            new RegExp(sizeRegex + " " + coffeesRegex),
            new RegExp(countsRegex + " " + sizeRegex),
            new RegExp(coffeesRegex),
            new RegExp(sizeRegex),
        ];
        let empty = false;
        for (let i = 0; i < coffeeRegex.length; i++) {
            const reg = coffeeRegex[i];
            const match = request.toLowerCase().match(reg);
            //console.log("REQUEST BEFORE", request);
            if (match) {
                const index = match["index"];
                const sentence = request.slice(index, index + match[0].length).split(" ");
                request = request.replace(reg, "");

                console.log("SENTENCE", sentence);
                console.log("REQUEST", request);

                let count = oldCount || "", size = oldSize || "", coffee = oldCoffee || "";
                console.log("count", count, "size", size, "coffee", coffee);
                switch (i) {
                    case 0:
                        [count, size, ...coffee] = sentence;
                        console.log("COUNT-SIZE-COFFEE", count, size, coffee);
                        break;
                    case 1:
                        [count, ...coffee] = sentence;
                        console.log("COUNT-COFFEE", count, coffee);
                        break;
                    case 2:
                        [size, ...coffee] = sentence;
                        console.log("SIZE-COFFEE", size, coffee);
                        break;
                    case 3:
                        [count, size] = sentence;
                        console.log("COUNT SIZE", count, size);
                        break;
                    case 4:
                        [...coffee] = sentence;
                        console.log("COFFEE", coffee);
                        break;
                    case 5:
                        [size, ...coffee] = sentence;
                        console.log("SIZE", size);
                        break;
                    default:
                        empty = true;
                }

                coffee = (coffee || []).join(" ");

                const price = (counts.indexOf(count) > -1 ? counts.indexOf(count) + 1 : parseInt(count) || 1) * (((coffees.filter(i => i.name === coffee)[0] || {}).price || 0) + ((sizes.filter(i => i.name === size)[0] || {}).price || 0));
                requestedCoffees.push({count, size, coffee, price});
                reset();
                if (empty)
                    i = 0;
            }
        }
        oldRequestedCoffees = [...requestedCoffees];
        return this.prepareResponse()
    }

    prepareResponse() {
        if (!oldRequestedCoffees.length) {
            return "";
        }

        const noSize = oldRequestedCoffees.filter(i => !i.size);
        const noCoffee = oldRequestedCoffees.filter(i => !i.coffee);
        const noSizeCoffee = oldRequestedCoffees.filter(i => !i.size && i.coffee);
        let respSent = "";
        if (!noSize.length && !noCoffee.length) {
            let sent = "";
            let price = 0;
            oldRequestedCoffees.forEach((coffee, index, length) => {
                if (!index)
                    sent += coffee.count + " " + coffee.size + " " + coffee.coffee;
                else if (length - 1 == index && length > 1)
                    sent += " and " + coffee.count + " " + coffee.size + " " + coffee.coffee;
                else
                    sent += ", " + coffee.count + " " + coffee.size + " " + coffee.coffee;
                price += coffee.price;
            });

            respSent += `Preparing your ${sent}. ${price}$ please.`;
            reset();
        }
        if (noSizeCoffee.length) {
            let sent = noSizeCoffee[0].coffee;
            respSent = "Please pick a size of your " + sent + ".";
            this.response.list = sizes.map(i => capitalize(i.name));
            missedSize = true
        }
        return respSent;

    }


}

exports.Response = Response;
exports.Suggestion = Suggestion;
