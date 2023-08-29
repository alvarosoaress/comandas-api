function deleteObjKey<T extends Record<string, unknown>, K extends keyof T> (
  object: T,
  key: K
): Omit<T, K> {
  // Object.entries cria um array a partir de um objeto
  // filter para deixar no array todos items que sua key (sua posição [0])
  // seja diferente de 'Key'
  // Object.fromEntries cria um objeto a partir do array filtrado
  return Object.fromEntries(
    Object.entries(object).filter((item) => item[0] !== key)
  ) as Omit<T, K>;
}

export default deleteObjKey;
