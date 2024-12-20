
export interface Project{
  nickname: string,
  title: string,
  owner: string,
  length: number,
  poster: string,
  artist: string,
  type: 'Vinyl' | 'Cassette' | 'CD' | 'SACD' | 'BD' | string,
  keyStaff: Staff[],
  pnumber: number,
  color: string,
  done: boolean,
  scansDone: boolean,
  updateChannel: string,
  releaseChannel: string,
  additionalStaff: Staff[],
  tasks: Task[]
  scans: Scans[]
};

export interface Staff {
  id: string,
  role: Role
};

export interface Role {
  abbreviation: string,
  title: string
};

export type Task = {
  abbreviation: string,
  done: boolean
};

export type Scans = {
  id: string,
  abbreviation: string,
  title: string,
  done: boolean
};

export type DatabaseData = {
  guilds: {[key:string]: {[key:string]: Project}}
}