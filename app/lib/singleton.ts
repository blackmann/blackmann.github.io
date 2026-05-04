function makeSingleton<T>(name: string, factory: () => T): T {
  let instance: T;
  if (process.env.NODE_ENV === "production") {
    instance = factory();
  } else {
    if (!(global as any)[name]) {
      (global as any)[name] = factory();
    }
    instance = (global as any)[name];
  }

  return instance;
}

export { makeSingleton };
