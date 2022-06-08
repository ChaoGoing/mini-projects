let encode, decode;

{
  encode = (str) => {
    return Buffer.from(str).toString('base64')
  };

  decode = (str) => {
    return Buffer.from(str, 'base64').toString()
  };
}

export { decode, encode };
