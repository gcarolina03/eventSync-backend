const router = require("express").Router();
const { createNotification, getNotificationsByUser, markNotificationAsRead, deleteNotification } = require("../controllers/notification.controller");
const { checkAuth, checkAdmin } = require("../../middlewares/auth");

router.post('/', createNotification);

router.get('/user/:userId', checkAuth, getNotificationsByUser);

router.put('/:id/read', checkAuth, markNotificationAsRead);

router.delete('/:id', checkAdmin, deleteNotification);

module.exports = router;
