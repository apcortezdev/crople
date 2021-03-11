const validateNameSlur = (name) => {
  const re1 = /a+r+s+e+|f+u+c+k+|s+h+i+t+|ass+|p+i+s+|w+a+n+k+|j+e+r+k+|b+i+t+c+h+|b+i+n+t+|c+u+n+t+|k+n+o+b+|c+o+c+k+|m+i+n+g+e+/;
  const re2 = /p+u+s+s+y+|p+o+n+|p+u+n+a+n+i+|t+w+a+t+|p+r+i+c+k+|g+a+s+h+|c+l+u+n+g+e+|s+n+a+t+c+h+|f+a+n+y+|t+i+t+/;
  const re3 = /n+i+g+e+r*|n+i+g+l+e+t+|n+i+p+|a+b+[e+|i+]+d|b+a+m+b+o+u+l+a|b+e+a+n+e*[r+|y+]|c+h+u+r+k+a+|g+o+m+b+a+h+/;
  const re4 = /j+i+d+a+n+|r+a+s+t+u+s+|a+s+h+k+e/;
  // const re4 = /t+e+s+[t?|i?]/;

  if (re1.test(String(name).toLowerCase())) return false;
  if (re2.test(String(name).toLowerCase())) return false;
  if (re3.test(String(name).toLowerCase())) return false;
  if (re4.test(String(name).toLowerCase())) return false;
  return true;
};

const validateNameSize = (name) => {
  if (name.toString().length < 4 || name.toString().length > 10) {
    return false;
  }
  return true;
};

const validateIsEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

export { validateNameSlur, validateNameSize, validateIsEmail };
