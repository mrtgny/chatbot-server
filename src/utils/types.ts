import type { Express } from "express";
import { connection, server as WebSocketServer } from "websocket";

export interface ISendMessage {
  author: AUTHOR_ENUM;
  message: string | string[];
  status?: string;
  suggest?: boolean;
  date: string;
}

export interface IRequest {
  id: string;
  message: string;
  suggest: boolean;
}

export interface IAppRoute {
  public: (app: Express) => void;
  private: (app: Express) => void;
}

export interface ICoffee {
  name: CoffeeType;
  offers: [];
  price: 11.25;
}

export enum AUTHOR_ENUM {
  CHATBOT = "chatbot",
  USER = "user",
}

export interface IResponse {
  author: AUTHOR_ENUM;
  date: string;
  list?: string[];
  options?: string[];
  coffees?: ICoffeeOrder[];
  name?: string;
  message?: string;
  status?: string;
  suggest?: boolean;
  count?: number;
}

export declare type CoffeeType =
  | "latte"
  | "filter coffee"
  | "cold brew"
  | "americano"
  | "cappucino"
  | "doppio"
  | "espresso macchiato"
  | "flat white";
export declare type CoffeeCountType =
  | "a"
  | "two"
  | "three"
  | "four"
  | "five"
  | "six"
  | "seven"
  | "eight"
  | "nine";
export declare type CoffeeSizeType = "tall" | "grande" | "venti";

export interface ICoffeeOrder {
  size: CoffeeSizeType;
  count: CoffeeCountType | string | number;
  coffee: CoffeeType;
  price?: number;
}

export interface IConnectionData {
  oldSize?: CoffeeSizeType | string;
  oldCoffee?: string[];
  oldCount?: string;
  name?: string;
  oldRequestedCoffees?: ICoffeeOrder[];
  missedSize?: boolean;
  nameRequested?: boolean;
}

export interface IConnection {
  connection: connection;
  data: IConnectionData;
}

export interface ISocketAppRoute {
  public: (socket: WebSocketServer) => void;
  private: (socket: WebSocketServer) => void;
}
