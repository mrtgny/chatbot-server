import { IConnection } from "./types";

const NODE_ENV = process.env.NODE_ENV!
const connections: Record<string, IConnection> = {}


export const coffees = [
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

export const requests = [
    "i want to take",
    "i would like to take",
    "i want to drink",
    "can i take",
    "could i take",
]

export const sizes = [
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

export const hellos = [
    "good morning",
    "good evening",
    "good afternoon",
    "good night",
    "hello",
    "hi",
];

export const lists = [
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

export const counts = ["a", "two", "three", "four", "five", "six", "seven", "eight", "nine"];


export const standardAnswers = [
    [["how are you", "what's up", "how is it going"], ["fine", "m good", "ok"], ["bad", "sad"], ["thank you"], ["have a nice day", "bye", "take care yourself", "good bye"]],
    [["I am fine. Thank you for asking. What about you?", "I'm ok. What about you?"], ["I'm glad to hear that!"], ["I'm sorry to hear that :( How can i help you?"], ["You are welcome :)"], ["Have a nice day :)", "Good bye!", "Bye bye!"]]
];


export const possibleAnswers = [...coffees.map(i => i.name), ...sizes.map(i => i.name), ...lists, ...counts, ...requests, ...hellos, ...standardAnswers[0].join(",").split(",")]

export {
    NODE_ENV,
    connections
};

