import { TeamMember } from "./TeamMember";

export type RegisterTeamDto = {
    clubId?: string;
    miembros: TeamMember[];
    capitanId: string;
    fechaCreacion?: string;
};

