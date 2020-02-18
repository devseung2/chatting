const express = require("express");
const router = express.Router();
const modChats = require('../../models/Chats');

const addMsg = async (id, msg, channel) => {
	const msgInfo = new modChats({ id, msg, channel });
	await msgInfo.save();
	return true;
};

const getMsgList = async (channel) => {
	const chatListInfo = await modChats.find({ channel });
	return chatListInfo;
};

// 전체 채팅 메시지 리스트 얻기
router.get("/messages", async (req, res) => {
	const {channel} = req.query;
	const msgList = await getMsgList(channel);
	res.send(msgList);
});

// 메시지 전송
router.post('/send', async (req, res, next) => {
	try {
		const { id, msg, channel } = req.body.sendInfo;
		const ret = await addMsg(id, msg, channel);
		res.send(ret);
	} catch (err) {
		next(err);
	}
});

module.exports = router;