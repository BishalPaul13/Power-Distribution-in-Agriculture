const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const formatElectricityAccount = (account = {}) => {
  const subsidizedUnits = Number(account.subsidizedUnits || 0);
  const purchasedUnits = Number(account.purchasedUnits || 0);
  const totalSubsidyGranted = Number(account.totalSubsidyGranted || 0);
  const totalUnitsConsumed = Number(account.totalUnitsConsumed || 0);
  const totalPaidUnitsPurchased = Number(account.totalPaidUnitsPurchased || 0);
  const totalAmountSpent = Number(account.totalAmountSpent || 0);

  return {
    subsidizedUnits,
    purchasedUnits,
    totalSubsidyGranted,
    totalUnitsConsumed,
    totalPaidUnitsPurchased,
    totalAmountSpent,
    lastSubsidyAt: account.lastSubsidyAt || null,
    availableUnits: subsidizedUnits + purchasedUnits
  };
};

const serializeUser = (user, includeTransactions = false) => {
  const base = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    electricityAccount: formatElectricityAccount(user.electricityAccount)
  };

  if (!includeTransactions) return base;

  return {
    ...base,
    electricityTransactions: [...(user.electricityTransactions || [])]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 12)
  };
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ msg: 'Please enter all fields' });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashed, role: role || 'farmer' });
    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, role: user.role, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Please enter all fields' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, role: user.role, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(serializeUser(user, true));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    res.json(farmers.map((farmer) => serializeUser(farmer)));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const grantSubsidy = async (req, res) => {
  try {
    const { units, note } = req.body;
    const subsidyUnits = Number(units);

    if (!Number.isFinite(subsidyUnits) || subsidyUnits <= 0) {
      return res.status(400).json({ msg: 'Please provide a valid subsidy unit amount' });
    }

    const farmer = await User.findOne({ _id: req.params.id, role: 'farmer' });
    if (!farmer) return res.status(404).json({ msg: 'Farmer not found' });

    farmer.electricityAccount.subsidizedUnits += subsidyUnits;
    farmer.electricityAccount.totalSubsidyGranted += subsidyUnits;
    farmer.electricityAccount.lastSubsidyAt = new Date();
    farmer.electricityTransactions.unshift({
      type: 'subsidy',
      units: subsidyUnits,
      amount: 0,
      note: note || 'Government electricity subsidy credited'
    });

    await farmer.save();
    res.json({
      msg: 'Subsidy credited successfully',
      farmer: serializeUser(farmer, true)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

const consumeElectricity = async (req, res) => {
  try {
    const { units, purpose, note } = req.body;
    const consumedUnits = Number(units);

    if (!Number.isFinite(consumedUnits) || consumedUnits <= 0) {
      return res.status(400).json({ msg: 'Please provide a valid usage unit amount' });
    }

    const farmerId = req.params.id || req.user.userId;
    const farmer = await User.findOne({ _id: farmerId, role: 'farmer' });
    if (!farmer) return res.status(404).json({ msg: 'Farmer not found' });

    const availableUnits =
      Number(farmer.electricityAccount.subsidizedUnits || 0) +
      Number(farmer.electricityAccount.purchasedUnits || 0);

    if (consumedUnits > availableUnits) {
      return res.status(400).json({ msg: 'Not enough electricity units available in your account' });
    }

    const subsidyUsed = Math.min(farmer.electricityAccount.subsidizedUnits, consumedUnits);
    const paidUsed = consumedUnits - subsidyUsed;

    farmer.electricityAccount.subsidizedUnits -= subsidyUsed;
    farmer.electricityAccount.purchasedUnits -= paidUsed;
    farmer.electricityAccount.totalUnitsConsumed += consumedUnits;
    farmer.electricityTransactions.unshift({
      type: 'usage',
      units: consumedUnits,
      amount: 0,
      purpose: purpose || '',
      note: note || `Meter update: ${subsidyUsed} subsidy units and ${paidUsed} paid units consumed`
    });

    await farmer.save();
    res.json({
      msg: 'Electricity usage recorded successfully',
      farmer: serializeUser(farmer, true)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

module.exports = {
  register,
  login,
  getMe,
  getAllFarmers,
  grantSubsidy,
  consumeElectricity
};
