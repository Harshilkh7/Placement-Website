import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET || 'access_secret',
    { expiresIn: '15m' },
  );
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: '7d' },
  );
  return { accessToken, refreshToken };
};

const validateCredentials = (name, email, password) => {
  if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
    return 'Name is required';
  }
  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
    return 'A valid email is required';
  }
  if (typeof password !== 'string' || password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body || {};
    const validationError = validateCredentials(name, email, password);
    if (validationError) return res.status(400).json({ message: validationError });

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const safeRole = ['student', 'admin', 'recruiter', 'senior'].includes(role) ? role : 'student';
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: safeRole,
    });
    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshToken = refreshToken;
    await user.save();
    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(201).json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const validationError = validateCredentials(undefined, email, password);
    if (validationError) return res.status(400).json({ message: validationError });

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie('refreshToken', refreshToken, cookieOptions);

    res.status(200).json({
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
    res.status(200).json({ accessToken: tokens.accessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    res.clearCookie('refreshToken', cookieOptions);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout error:', error);
    next(error);
  }
};
