import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { buscarAccion } from "./index.mjs";

const bot = new TelegramBot(process.env.token, { polling: true });

const TIME_LIMIT = process.env.TIME_LIMIT || 10 * 60 * 1000;
const chatStates = {};

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, resp);
});

const returnMensajePrincipal = (id) =>
  bot.sendMessage(
    id,
    `
    Hola, siempre es un gusto atenderte, ¿qué podemos hacer por ti hoy?
    - 1 o soporte: para Soporte Técnico
    - 2 o seguimiento:  para Seguimiento de producto
    - 3 o horario:  para Nuestro horario de atención
    - 4 o pedido:  para realizar un pedido
    - 5 o producto:  para saber más acerca de este producto
    - 6 o tienda:  para visitar nuestra tienda
    `
  );

bot.on("message", async ({ chat: { id }, text = "principal" }) => {
  const idHistory = chatStates[id];
  const lastCommand = idHistory?.lastCommand;
  const fn = buscarAccion({ text, id: text, lastCommand });
  const currentTime = Date.now();
  try {
    if (idHistory) {
      const lastInteraction = idHistory.lastInteraction;
      if (currentTime - lastInteraction > TIME_LIMIT) {
        delete chatStates[id];
        return bot.sendMessage(
          id,
          "¡Ha pasado un tiempo sin interacción! Si deseas continuar, por favor escribe de nuevo."
        );
      }
    } else if (idHistory === undefined) {
      chatStates[id] = {
        lastInteraction: currentTime,
      };
      return returnMensajePrincipal(id);
    }

    if (
      "principal"?.toLowerCase().includes(text) ||
      text?.toLowerCase().includes("principal")
    ) {
      chatStates[id] = {
        lastCommand: null,
      };
      return returnMensajePrincipal(id);
    }

    const response = await fn(text, lastCommand);
    if (!idHistory?.lastCommand) {
      idHistory.lastCommand = text;
    }
    if (response?.endsWith(".png")) {
      bot.sendPhoto(id, response, {
        caption: "Aquí está tu código de barras para la factura que debes:",
      });
    } else {
      bot.sendMessage(id, response);
    }
  } catch (error) {
    bot.sendMessage(id, error.message);
  }
});

bot.on("error", console.log);

bot.on("connect", (params) => {
  console.log(params);
});
