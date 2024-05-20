const ENDPOINT = process.env.NODE_ENV === "production"
? "https://fns.degreat.co.uk"
: "http://localhost:5678"

export { ENDPOINT }
