const PowerRequest = require('../models/PowerRequest');
const User = require('../models/User');

const PAID_TOP_UP_RATE = 6;

const createRequest = async (req, res) => {
  try {
    const { area, powerRequired, purpose, requestType } = req.body;
    const userId = req.user.userId;
    const requiredUnits = Number(powerRequired);

    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ msg: 'User not found' });
    if (!Number.isFinite(requiredUnits) || requiredUnits <= 0) {
      return res.status(400).json({ msg: 'Please provide a valid unit requirement' });
    }

    const normalizedRequestType = requestType === 'paid_topup' ? 'paid_topup' : 'standard';
    const estimatedAmount = normalizedRequestType === 'paid_topup' ? requiredUnits * PAID_TOP_UP_RATE : 0;

    const pr = new PowerRequest({
      farmer: userId,
      farmerName: user.name,
      area,
      powerRequired: requiredUnits,
      purpose,
      requestType: normalizedRequestType,
      ratePerUnit: normalizedRequestType === 'paid_topup' ? PAID_TOP_UP_RATE : 0,
      estimatedAmount,
      paymentStatus: normalizedRequestType === 'paid_topup' ? 'PendingPayment' : 'NotRequired'
    });

    await pr.save();
    res.json(pr);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await PowerRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getRequestsByFarmer = async (req, res) => {
  try {
    const userId = req.user.userId;
    const requests = await PowerRequest.find({ farmer: userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const approveRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const reqDoc = await PowerRequest.findById(id);
    if (!reqDoc) return res.status(404).json({ msg: 'Request not found' });

    if (reqDoc.status !== 'Pending') {
      return res.status(400).json({ msg: `This request is already ${reqDoc.status.toLowerCase()} and cannot be changed.` });
    }

    if (reqDoc.requestType === 'paid_topup') {
      const farmer = await User.findById(reqDoc.farmer);
      if (!farmer) return res.status(404).json({ msg: 'Farmer not found for this request' });

      farmer.electricityAccount.purchasedUnits += reqDoc.powerRequired;
      farmer.electricityAccount.totalPaidUnitsPurchased += reqDoc.powerRequired;
      farmer.electricityAccount.totalAmountSpent += reqDoc.estimatedAmount || 0;
      farmer.electricityTransactions.unshift({
        type: 'paid_topup',
        units: reqDoc.powerRequired,
        amount: reqDoc.estimatedAmount || 0,
        purpose: reqDoc.purpose || '',
        note: `Paid electricity request approved for ${reqDoc.area}`
      });
      await farmer.save();
    }

    reqDoc.status = 'Approved';
    reqDoc.approvedAt = new Date();
    if (reqDoc.requestType === 'paid_topup') {
      reqDoc.paymentStatus = 'Paid';
    }
    await reqDoc.save();

    res.json(reqDoc);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const rejectRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const reqDoc = await PowerRequest.findById(id);
    if (!reqDoc) return res.status(404).json({ msg: 'Request not found' });

    if (reqDoc.status !== 'Pending') {
      return res.status(400).json({ msg: `This request is already ${reqDoc.status.toLowerCase()} and cannot be changed.` });
    }

    reqDoc.status = 'Rejected';
    await reqDoc.save();
    res.json(reqDoc);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const deleteRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await PowerRequest.findById(id);
    if (!doc) return res.status(404).json({ msg: 'Request not found' });

    if (doc.status !== 'Pending') {
      return res.status(400).json({ msg: `This request is already ${doc.status.toLowerCase()} and cannot be deleted.` });
    }

    await doc.deleteOne();
    res.json({ msg: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestsByFarmer,
  approveRequest,
  rejectRequest,
  deleteRequest
};
