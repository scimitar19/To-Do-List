   
    export function Autobind(target: any, name: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const adjDescriptor: PropertyDescriptor = {
      configurable: true,
      enumerable: false,
      get() {
          const boundFunction = originalMethod.bind(this);
        return boundFunction;
      },
    };
    return adjDescriptor;
  }