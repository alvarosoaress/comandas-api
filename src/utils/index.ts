function deleteObjKey<T extends Record<string, unknown>, K extends keyof T>(
  object: T,
  key: K,
): void {
  // delete object[key] serve para alterar o object passado
  // sem criar uma nova referência dele
  // ou seja, a função muta o object passado
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete object[key];
}

export default deleteObjKey;
