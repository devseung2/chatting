const express = require("express");
const router = express.Router();
const modUsers = require('../../models/Users');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const genHashedPw = async rawPw => {
	const hashedPw = await bcrypt.hash(rawPw, saltRounds);
	return hashedPw;
};

const isEqualPw = async (rawPw, hashedPw) => {
	const isEqual = await bcrypt.compare(rawPw, hashedPw);
	return isEqual;
};

const findById = async id => {
	const userInfo = await modUsers.findOne({ id });
	return userInfo;
};

const isExistsById = async id => {
	const userInfo = await findById(id);
	return !!userInfo;
};

const isExistsUserInfo = async (id, pw) => {
	const e = new Error('isExistsUserInfo');
	const userInfo = await findById(id);

	if (!userInfo) {
		e.status = 420;
		throw e;
	}

	const isEqualPwInfo = await isEqualPw(pw, userInfo.pw);
	if (!isEqualPwInfo) {
		e.status = 420;
		throw e;
	}

	return true;
};

const userAdd = async (id, pw) => {
	const e = new Error('userAdd');
	const isExists = await isExistsById(id);

	if (isExists) {
		e.status = 419;
		throw e;
	}

	const hashedPw = await genHashedPw(pw);
	const newUserInfo = new modUsers({ id, pw: hashedPw });

	await newUserInfo.save();
	return true;
};

router.post("/signin", async (req, res, next) => {
  	try {
		const { id, pw } = req.body;
		const ret = await isExistsUserInfo(id, pw);
		req.session.user = { id };
		res.send(ret);
	} 
	catch (err) {
		next(err);
	}
});

router.post("/signup", async (req, res, next) => {
  	try {
		const { id, pw } = req.body;
		const ret = await userAdd(id, pw);
		res.send(ret);
	}
	catch (err) {
		next(err);
	}
});

router.get("/signout", (req, res) => {
	console.log("signout 접속");
	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
		} else {
			res.clearCookie('app.sid', { path: '/' });
		}
		res.send(true);
	});
});

router.get("/id", async (req, res) => {
	await res.send(req.session && req.session.user && req.session.user.id);
});

module.exports = router;