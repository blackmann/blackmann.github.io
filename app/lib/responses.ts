import { data as json } from "react-router";

function badRequest<T>(data?: T) {
  return json(data, { status: 400 });
}

function methodNotAllowed<T>(data?: T) {
  return json(data, { status: 405 });
}

function notFound<T>(data?: T) {
  return json(data, { status: 404 });
}

function forbidden<T>(data?: T) {
  return json(data, { status: 403 });
}

function unauthorized<T>(data?: T) {
  return json(data, { status: 401 });
}

export { badRequest, forbidden, methodNotAllowed, notFound, unauthorized };
