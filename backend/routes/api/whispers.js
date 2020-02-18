const express = require("express");
const router = express.Router();
const modChats = require('../../models/Chats');

const getWhisperMsgList = async (id, receiver) => {
	const whisperListInfo = await modChats.find().or([{ id : id, channel : receiver }, { id : receiver, channel : id }]);
	return whisperListInfo;
};

// 귓속말 메시지 리스트 얻기
router.get("/messages", async (req, res) => {
	const { id, receiver } = req.query;
	const whisperList = await getWhisperMsgList(id, receiver);
	res.send(whisperList);
});

module.exports = router;