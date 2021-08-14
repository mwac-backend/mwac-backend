module.exports.validateResult = {
    query,
    error,
  };
  
  function query(result) {
    const {
      success,
      message,
    } = result[0];
    if (success === 0) throw message;
    return {
        success,
        message
    };
  }
  
  function error(e) {
    const err = Error();
    if (e instanceof Error) {
      err.message = e.message;
    } else {
      err.message = e;
    }
    err.statusCode = 400;
    return err;
  }
  