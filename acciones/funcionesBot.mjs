import bwipjs from "bwip-js";
import { join } from "path";
import fs from "fs";

export const notFound = (text = "") => `No se encontro la accion ${text}`;

export const consultar = (text) => `estas consultando por ${text}`;

export const validarNumero = (numero) => {
  if (!numero || !validarTelefono(numero)) {
    throw new Error("No se proporciono un numero valido");
  }
  return true;
};

export const validarTelefono = (numero) => /^[67]\d{3}-?\d{4}$/.test(numero);

const indiceRandom = (max = 3, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generarNPE = (longitud = 30) => {
  let npe = "";
  for (let i = 0; i < longitud; i++) {
    // Generar un número aleatorio entre 0 y 9
    const digito = Math.floor(Math.random() * 10);
    npe += digito;
  }
  return npe;
};

const generateBarcode = (text, numero = null) => {
  return new Promise((resolve, reject) => {
    const barcodePath = join(process.cwd(), "barcode.png");

    bwipjs.toBuffer(
      {
        bcid: "code128",
        text: text,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: "center",
      },
      (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          fs.writeFile(barcodePath, buffer, (writeErr) => {
            if (writeErr) {
              reject(writeErr);
            } else {
              resolve(barcodePath);
            }
          });
        }
      }
    );
  });
};

export const generarPago = async (text) => {
  const [, telefono] = text.split(" ");
  validarNumero(telefono);
  const codigo = generarNPE();
  const barcodePath = await generateBarcode(codigo);
  return barcodePath;
};

const respuestas = [
  { estado: "no_encontrado", mensaje: "El número no se encuentra registrado." },
  {
    estado: "mora",
    mensaje:
      "El número tiene dos meses de mora. Por favor, acérquese a una agencia para resolverlo.",
  },
  {
    estado: "a_tiempo",
    mensaje: "El número está al día. Ya ha cancelado su factura",
  },
  {
    estado: "puede_cancelar",
    mensaje:
      "El número está a tiempo de cancelar su factura. Podemos apoyarle por este medio. Indique /pago seguido de su numero",
  },
];
export const buscarNumeroTelefonico = (text) => {
  const [, busqueda] = text.split(" ");
  validarNumero(busqueda);
  const respuesta = respuestas[indiceRandom()];
  return respuesta.mensaje;
};

export const seguimiento = (numeroSeguimiento = null, lastCommand = null) => {
  if (!lastCommand) {
    return "Por favor, proporciona tu número de seguimiento válido.";
  }

  const currentTime = Date.now();

  return currentTime % 2 === 0
    ? `Tu paquete con código ${numeroSeguimiento} está en camino`
    : "No se encontró el número de seguimiento";
};

export const horario = () => "Nuestro horario de atención es de 9 AM a 5 PM.";

const agente = () => "Espera en línea, un agente tomará el chat para apoyarte";
const pago = () =>
  "Esta incidencia usualmente se debe a que el método de pago no está autorizado para realizar compras internacionales";
const retardo = () =>
  "Hemos agregado un ticket relacionado con tu número, un agente se pondrá en contacto pronto para darte apoyo";

const accionesSoporte = [
  {
    id: 1,
    command: "pago",
    fn: pago,
  },
  {
    id: 1,
    command: "retardo",
    fn: retardo,
  },
  {
    id: 1,
    command: "agente",
    fn: agente,
  },
];

export const soporte = (numeroSeguimiento = null, lastCommand = null) => {
  if (!lastCommand) {
    return `
    Este es el soporte técnico. ¿En qué puedo ayudarte?
    1 o pago: ayuda con mi método de pago, describe qué incidencia tienes
    2 o retardo: Ayuda con una orden demorada
    3 o agente: Soporte directamente con un agente
    4 o principal: regresar al menú principal
    `;
  }
  const fn =
    accionesSoporte.find(
      (elemento) =>
        elemento.command.includes(numeroSeguimiento.toLowerCase()) ||
        elemento.id === +numeroSeguimiento
    )?.fn || notFound;
  return fn();
};

export const pedido = () => "Por favor, indícanos qué deseas pedir.";

export const producto = (numeroSeguimiento = null, lastCommand = null) => {
    if(!lastCommand){
        "¿Qué producto te gustaría conocer más?"
    }
  const currentTime = Date.now();

  return currentTime % 2 === 0
  ? `El producto ${numeroSeguimiento} actualmente está fuera de stock`
  : "Estos son los detalles del producto";
};

export const tienda = () =>
  "¡Te invitamos a visitar nuestra tienda!, actualmente estamos ubicados en calle el hipódromo";
