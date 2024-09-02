const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				ok: false,
				msg: 'Email already exists',
			});
		}

		user = new User(req.body);

		// Encrypt password
		const salt = bcrypt.genSaltSync(10);
		user.password = bcrypt.hashSync(password, salt);

		// Save user
		await user.save();

		res.status(201).json({
			ok: true,
			uid: user._id,
			name: user.name,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Contact one admin',
		});
	}
};

const loginUser = async (req, res = response) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	try {
		if (!user) {
			return res.status(400).json({
				ok: false,
				msg: 'The user not exist',
			});
		}

		// Validate passwords

		const validPassword = bcrypt.compareSync(password, user.password); // devuelve un boolean

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'Incorrect password',
			});
		}

		// Generar nuestro JSON WEB TOKEN (JWT)

    const token = await generarJWT(user._id, user.name);


    res.json({
      ok: true,
      uid: user._id,
      name: user.name,
      token
    })

	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: 'Contact one admin',
		});
	}
};

const renewToken = async(req, res = response) => {

  const uid = req.uid;
  const name = req.name;

  const token = await generarJWT(uid, name);

	res.json({
		ok: true,
    token
	});
};

module.exports = {
	createUser,
	loginUser,
	renewToken,
};
