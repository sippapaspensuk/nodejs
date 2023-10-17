const express = require("express");
const { OrderItems, Orders, Products, Carts, Users } = require("../models");
const {
  uniqueNamesGenerator,
  NumberDictionary,
  animals,
  colors,
} = require("unique-names-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getById = async (req, res, next) => {
  try {
    let user;
    user = await Users.findAll({
      attributes: ['id', 'username', 'password', 'firstname', 'lastname', 'email', 'phone'],
      where: { id: req.params.id },
      raw: true,
    });

    res.status(200).json({ status: true, data: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    let user;
    let { username, password, firstname, lastname, email, phone } = req.body;

    let userExisted = await Users.findOne({
      where: { username },
    });
    if (userExisted) {
      return res
        .status(200)
        .json({ status: false, message: "Username already exists" });
    }
    if (!password) {
      password = phone;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await Users.create({
      ...req.body,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({ status: true, data: { token } });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const pulledUser = await Users.findOne({
      where: { username },
    });

    if (!pulledUser)
      return res
        .status(200)
        .json({ status: false, message: "Username not found" });

    const isMatch = await bcrypt.compare(password, pulledUser.password);
    if (!isMatch)
      return res
        .status(200)
        .json({ status: false, message: "Password is incorrect" });

    const token = jwt.sign({ id: pulledUser.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({ status: true, data: token });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    let user;
    await Users.update({ ...req.body }, { where: { id: req.params.id } });
    user = await Users.findAll({
      attributes: ['id', 'username', 'password', 'firstname', 'lastname', 'email', 'phone'],
      where: { id: req.params.id },
      raw: true,
    });

    res.status(200).json({ status: true, data: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { Op } = require("sequelize");
    const searchUser = await Users.findAll({
      where:
      {
        [Op.or]: [
          {
            username: {
              [Op.like]: `%${req.query.username}%`,
            },
          }, {
            firstname: {
              [Op.like]: `%${req.query.firstname}%`,
            },
          }, {
            lastname: {
              [Op.like]: `%${req.query.lastname}%`,
            },
          }, {
            phone: {
              [Op.like]: `%${req.query.phone}%`,
            },
          }, {
            email: {
              [Op.like]: `%${req.query.email}%`,
            },
          },
        ],
      },
    });

    res.status(200).json({ status: true, data: searchUser });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
