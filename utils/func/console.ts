export class devLog {
  isAllow: boolean = false;

  constructor() {
    this.isAllow = process.env.NODE_ENV !== "development";
  }

  log = (...data: any[]) => {
    if (this.isAllow) {
      return;
    }
    console.log(...data);
  }
  
  error = (...data: any[]) => {
    if (this.isAllow) {
      return;
    }
    console.error(...data);
  }
}
