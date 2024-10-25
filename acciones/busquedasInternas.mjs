import {
  notFound,
  soporte,
  seguimiento,
  horario,
  pedido,
  producto,
  tienda,
} from "./index.mjs";

export const acciones = [
  {
    id: 1,
    command: "soporte",
    fn: soporte,
  },
  {
    id: 2,
    command: "seguimiento",
    fn: seguimiento,
  },
  {
    id: 3,
    command: "horario",
    fn: horario,
  },
  // {
  //   id: 4,
  //   command: "pedido",
  //   fn: pedido,
  // },
  {
    id: 5,
    command: "producto",
    fn: producto,
  },
  {
    id: 6,
    command: "tienda",
    fn: tienda,
  },
];

export const buscarAccion = ({ text, id, lastCommand = null }) =>
  acciones.find((element) => lastCommand?.toLowerCase()?.includes(element.command))?.fn ||
  acciones.find((element) => +lastCommand === element.id)?.fn ||
  acciones.find((element) => text?.toLowerCase()?.includes(element.command))?.fn ||
  acciones.find((element) => +id === element.id)?.fn ||
  notFound;
