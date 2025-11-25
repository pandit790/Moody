function success(res, data = {}, code = 200) {
  return res.status(code).json(data);
}

function error(res, message = "Server error", code = 500, details = null) {
  const payload = { error: message };
  if (details) payload.details = details;
  return res.status(code).json(payload);
}

module.exports = { success, error };
