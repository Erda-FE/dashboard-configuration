class DcRegisterComp implements DC.DcRegisterComp {
  private Comps: {};
  private static instance: DcRegisterComp;

  constructor() {
    if (!DcRegisterComp.instance) {
      DcRegisterComp.instance = this;
    }
    this.Comps = {};
    return DcRegisterComp.instance;
  }

  use<C = JSX.Element, D = {} | Array<any>>(name: DC.ViewType, Comp: C, config?: { dataConvert?: (data: any) => D }) {
    if (!(name in this.Comps)) {
      this.Comps[name] = {
        Comp,
        config,
      };
    }
    return this;
  }

  getComp<C = JSX.Element, D = {} | Array<any>>(
    name: DC.ViewType,
    defaultComp: any,
  ): { Comp: C; config?: { dataConvert?: (data: any) => D } } {
    const data = this.Comps[name] ?? {
      Comp: defaultComp,
      config: {},
    };
    return data;
  }
}

const dcRegisterComp = new DcRegisterComp();

export default dcRegisterComp;
