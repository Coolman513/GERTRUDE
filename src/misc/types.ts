
export interface Project {
  nickname: string,
  title: string,
  owner: string
  length: number,
  poster: string,
  type: 'Vinyl' | 'CD' | 'BD' | string,
  keyStaff: Staff[],
  pnumber: pnumber[],
  done: boolean,
  updateChannel: string,
  releaseChannel: string
};

export interface pnumber {
  number: number,
  done: boolean,
  additionalStaff: Staff[],
  tasks: Task[]
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

export type DatabaseData = {
  guilds: {[key:string]: {[key:string]: Project}}
}