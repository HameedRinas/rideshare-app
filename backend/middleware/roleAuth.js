const roleAuth = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

const isDriver = (req, res, next) => {
  if (!req.user || (req.user.role !== 'driver' && req.user.role !== 'both')) {
    return res.status(403).json({ error: 'Driver access required' });
  }
  next();
};

const isRider = (req, res, next) => {
  if (!req.user || (req.user.role !== 'rider' && req.user.role !== 'both')) {
    return res.status(403).json({ error: 'Rider access required' });
  }
  next();
};

module.exports = { roleAuth, isDriver, isRider };