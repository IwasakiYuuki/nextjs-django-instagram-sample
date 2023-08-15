import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const db = require('../models/');
const config = require('../config/config.js')

export const authenticate = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: 'Access token is required.' })
  }
  jwt.verify(token, config.jwt.access_secret, (err: any, payload: any) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' })
    }

    req.body.email = payload.email
    next()
  })
}

export const account = async (req: express.Request, res: express.Response) => {
  try {
    const email = req.body.email
    const account = await db.Account.findOne({ where: { email: email } })
    if (!account) {
      return res.status(404).json({ message: 'Account not found.' })
    }
    const { password, ...account_without_password } = account.get()
    res.status(200).json({ accont: account_without_password })
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong.' })
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  // 認証
  const { email, password } = req.body;
  if ( !email || !password ) {
    return res.status(400).json({ message: 'email and password are required.' })
  }
  const account = await db.Account.findOne({ where: { email: email } })
  if (!account) {
    return res.status(401).json({ message: 'The email is incorrect.' })
  }
  const isValidPassword = await bcrypt.compare(password, account.password)
  if (!isValidPassword) {
    return res.status(401).json({ message: 'The password is incorrect.' })
  }

  // トークン発行
  const access_token = jwt.sign(
    { email },
    config.jwt.access_secret,
    { expiresIn: config.jwt.access_secret_expire }
  )
  const refresh_token = jwt.sign(
    { email },
    config.jwt.refresh_secret,
    { expiresIn: config.jwt.refresh_secret_expire }
  )
  return res.status(200).json({ access_token: access_token, refresh_token: refresh_token })
};

export const verify = async (req: express.Request, res: express.Response) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ message: 'Authorization is required.' })
  }
  // アクセストークンの検証
  jwt.verify(token, config.jwt.access_secret, (err: any, payload: any) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token.' })
    }

    return res.status(200).json({ payload })
  })
}

export const refresh = async (req: express.Request, res: express.Response) => {
  const refresh_token = req.body.refresh
  if (!refresh) {
    return res.status(401).json({ message: 'Refresh token is required.' })
  }
  // リフレッシュトークンの検証
  jwt.verify(refresh_token, config.jwt.refresh_secret, (err: any, payload: any) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid Refresh token.' })
    }
    // トークン再発行
    // TODO: 古いリフレッシュトークンをブラックリストに入れる処理
    const new_access_token = jwt.sign(
      { email: payload.email },
      config.jwt.access_secret,
      { expiresIn: config.jwt.access_secret_expire }
    )
    const new_refresh_token = jwt.sign(
      { email: payload.email },
      config.jwt.refresh_secret,
      { expiresIn: config.jwt.refresh_secret_expire }
    )
    return res.status(200).json({
      access_token: new_access_token,
      refresh_token: new_refresh_token
    })
  })
}

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, name, password } = req.body
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'Required fileds are missing.' })
    }
    const exist_account = await db.Account.findOne({ where: { email } })
    if (exist_account) {
      return res.status(400).json({ message: 'Email already in used.' })
    }
    const account = await db.Account.create({ email, name, password })
    return res.status(201).json({ account })
  } catch (err) {
    return res.status(500).json({ message: 'Something went wrong.' })
  }
}
