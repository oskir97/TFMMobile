import { DiaSemana } from "./DiaSemana";

export interface Horario {
    idhorario: number;
    inicio: Date | null;
    fin: Date | null;
    obtenerDiasSemana: DiaSemana[];
  }