export type CreateReservaDto = {
    usuarioId: string;
    fecha: string | null;
    horaInicio: string | null;
    horaTermino: string | null;
    canchaId: number | null;
    equipoId: number | null;
};
