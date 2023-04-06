export enum Status {
  ACTIVE,
  FINISHED,
}

export class Project {
  title: string;
  description: string;
  numbOfPeople: number;
  id: string;
  projectStatus: Status;
  constructor(t: string, d: string, np: number, id: string, ps: Status) {
    this.title = t;
    this.description = d;
    this.numbOfPeople = np;
    this.id = id;
    this.projectStatus = ps;
  }
}
