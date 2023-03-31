import { request } from "websocket";
import {
  coffees,
  connections,
  counts,
  hellos,
  lists,
  NODE_ENV,
  sizes,
  standardAnswers,
} from "./constants";
import {
  CoffeeCountType,
  CoffeeSizeType,
  CoffeeType,
  ICoffeeOrder,
  IConnection,
  IConnectionData,
  IRequest,
  IResponse,
  ISendMessage,
} from "./types";

export const validateUUIDV4 = (uuid: string) => {
  const regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

export const isTest = () => NODE_ENV === "test";

export const guid = () => {
  let d = new Date().getTime();
  let d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const createConnection: (request: request) => [IConnection, string] = (
  request: request,
) => {
  const id = guid();
  const connection = request.accept(null, request.origin);
  connections[id] = { connection, data: {} } as IConnection;
  return [connections[id], id];
};

export const sendMessage = (message: ISendMessage, id: string) => {
  const { connection } = getConnection(id);
  try {
    connection.send(JSON.stringify(message));
  } catch {
    connection.send(message);
  }
};

export const getConnection: (id: string) => IConnection = (id) =>
  connections[id];

export const resetConnection = (id: string) => {
  const connection = getConnection(id);
  connection.data = {
    oldSize: "",
    oldCoffee: [],
    oldCount: "",
    name: "",
    oldRequestedCoffees: [],
    missedSize: false,
    nameRequested: false,
  };
};

export const capitalize = (word: string) => {
  return word
    .split("")
    .map((letter, index) => (!index ? letter.toUpperCase() : letter))
    .join("");
};

export const fixMissedSize = (
  size: CoffeeSizeType,
  data: IConnectionData,
  response: IResponse,
  request: IRequest,
) => {
  const { oldRequestedCoffees } = data;
  const isValidSize =
    sizes.map((i) => i.name).filter((i) => i === size).length > 0;
  console.log("sizes", sizes, size, isValidSize);
  if (isValidSize) {
    oldRequestedCoffees!.filter((i) => !i.size && i.coffee)[0].size = size;
    data.missedSize = false;
    return prepareResponse(response, data, request);
  } else {
    response.list = sizes.map((i) => i.name);
    return "Please select an exists coffee size";
  }
};

export const parseRequest = (request: IRequest, response: IResponse) => {
  return prepareHello(request, response);
};

export const prepareHello = (request: IRequest, response: IResponse) => {
  let selectedHello = "";
  hellos.forEach((hello) => {
    const helloRegex = new RegExp(".*" + hello + ".*");
    const isHelloSelected = request.message.toLowerCase().match(helloRegex);

    if (isHelloSelected) {
      selectedHello += capitalize(hello) + ". ";
    }
  });
  return selectedHello + prepareStandardAnswers(request, response);
};

export const prepareStandardAnswers = (
  request: IRequest,
  response: IResponse,
) => {
  let standardAnswer = "";
  standardAnswers[0].forEach((requests, index) => {
    const responses = standardAnswers[1][index];
    const requestRegex = "(" + requests.join("|") + ")";
    const match = request.message.toLowerCase().match(requestRegex);
    if (match) {
      const answerIndex = parseInt(`${Math.random() * responses.length}`);
      standardAnswer += responses[answerIndex] + " ";
    }
  });

  return standardAnswer + findRequest(request, response);
};

export const prepareList = (request: IRequest) => {
  let showList = false;
  lists.forEach((list) => {
    const listRegex = new RegExp(list);
    const selectedList = request.message.toLowerCase().match(listRegex);
    if (!showList && selectedList) {
      showList = true;
    }
  });
  return showList ? coffees.map((coffee) => capitalize(coffee.name)) : [];
};

export const findRequest = (request: IRequest, response: IResponse) => {
  const { data } = getConnection(request.id);
  const { oldCount, oldCoffee, oldSize } = data;
  const { message: _message } = request;
  let message = _message.toLowerCase();
  const sizeRegex = "(" + sizes.map((i) => i.name).join("|") + ")";
  const countsRegex = "(" + counts.join("|") + "|[0-9])";
  const coffeesRegex = "(" + coffees.map((i) => i.name).join("|") + ")";
  const requestedCoffees: ICoffeeOrder[] = [];

  const coffeeRegex = [
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
    const match = message.match(reg);
    if (match) {
      const index = match["index"]!;
      const sentence = message.slice(index, index + match[0].length).split(" ");
      message = message.replace(reg, "");

      console.log("SENTENCE", sentence);
      console.log("REQUEST", message);

      let count = oldCount || "",
        size: CoffeeSizeType | string = oldSize || "",
        coffee: CoffeeType | string | string[] = oldCoffee || "";
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
      coffee = ((coffee as string[]) || []).join(" ");

      const price =
        (counts.indexOf(count) > -1
          ? counts.indexOf(count) + 1
          : parseInt(count) || 1) *
        (((coffees.filter((i) => i.name === coffee)[0] || {}).price || 0) +
          ((sizes.filter((i) => i.name === size)[0] || {}).price || 0));
      console.log("price", price);
      requestedCoffees.push({
        count,
        size: size as CoffeeSizeType,
        coffee: coffee as CoffeeType,
        price,
      });
      //reset();
      if (empty) {
        empty = false;
        i = 0;
      }
      i = -1;
    }
  }

  response.count = 0;

  requestedCoffees
    .map((i) => counts.indexOf(i.count as string) + 1)
    .forEach((i) => {
      if (!response.count) response.count = 0;
      response.count += i;
    });

  data.oldRequestedCoffees = [...requestedCoffees];
  return prepareResponse(response, data, request);
};

export const prepareResponse = (
  response: IResponse,
  data: IConnectionData,
  request: IRequest,
) => {
  const { name, oldRequestedCoffees } = data;
  if (!oldRequestedCoffees!.length) {
    return "";
  }

  const noSize = oldRequestedCoffees!.filter((i) => !i.size);
  const noCoffee = oldRequestedCoffees!.filter((i) => !i.coffee);
  const noSizeCoffee = oldRequestedCoffees!.filter((i) => !i.size && i.coffee);
  let respSent = "";

  if (!noSize.length && !noCoffee.length && !name!.length) {
    respSent = "Could you tell your name?";
    data.nameRequested = true;
  }

  if (noSizeCoffee.length) {
    const sent = noSizeCoffee[0].coffee;
    respSent = "Please pick a size of your " + sent + ".";
    response.list = sizes.map((i) => capitalize(i.name));
    data.missedSize = true;
  }

  if (!noSize.length && !noCoffee.length && name!.length) {
    let sent = "";
    let price = 0;
    oldRequestedCoffees!.forEach((coffee, index, length) => {
      const newCoffeeOrder: ICoffeeOrder = {
        coffee: coffee.coffee
          .split(" ")
          .map((i) => capitalize(i))
          .join(" ") as CoffeeType,
        size: coffee.size,
        count: coffee.count
          ? counts.indexOf(coffee.count as CoffeeCountType) > -1
            ? counts.indexOf(coffee.count as CoffeeCountType) + 1
            : parseInt(coffee.count as string)
          : 1,
      };
      response.coffees = [...(response.coffees || []), newCoffeeOrder];

      if (!index) sent += `${coffee.count} ${coffee.size} ${coffee.coffee}`;
      else if (length.length - 1 == index && length.length > 1)
        sent += ` and ${coffee.count} ${coffee.size} ${coffee.coffee}`;
      else sent += `, ${coffee.count} ${coffee.size} ${coffee.coffee}`;

      price += coffee.price!;
    });
    respSent += `Preparing your ${sent}. ${price}$ please.`;
    resetConnection(request.id);
  }

  return respSent;
};
