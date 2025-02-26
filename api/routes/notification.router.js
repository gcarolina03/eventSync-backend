const router = require("express").Router();
const { createNotification, getLatestNotifications, getAllNotifications, markNotificationAsRead, deleteNotification } = require("../controllers/notification.controller");
const { checkAuth, checkAdmin } = require("../../middlewares/auth");

router.post('/', createNotification);

router.get("/latest/:userId?", checkAuth, getLatestNotifications);
router.get("/all/:userId?", checkAuth, getAllNotifications);

router.put('/:id/read', checkAuth, markNotificationAsRead);

router.delete('/:id', checkAdmin, deleteNotification);

module.exports = router;
