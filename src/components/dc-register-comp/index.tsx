class DcRegisterComp implements DC.DcRegisterComp {
  private static instance: DcRegisterComp;
  private readonly Comps: {};

  constructor() {
    if (!DcRegisterComp.instance) {
      DcRegisterComp.instance = this;
    }
    this.Comps = {};
    return DcRegisterComp.instance;
  }

  use<C = JSX.Element, D = {} | any[]>(name: DC.ViewType, Comp: C, config?: { dataConvert?: (data: any) => D }) {
    if (!(name in this.Comps)) {
      this.Comps[name] = {
        Comp,
        config,
      };
    }
    return this;
  }

  getComp<C = JSX.Element, D = {} | any[]>(
    name: DC.ViewType,
    defaultComp: any,
  ): { Comp: C; config?: { dataConvert?: (data: any) => D } } {
    return (
      this.Comps[name] ?? {
        Comp: defaultComp,
        config: {},
      }
    );
  }
}

const dcRegisterComp = new DcRegisterComp();

export default dcRegisterComp;
