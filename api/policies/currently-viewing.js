
module.exports = async function (req, res, proceed) {

  const initiatorId = req.session.userId;
  if (initiatorId) {
    await ViewNow.destroy({ initiatorId });
  }

  proceed();
  
};