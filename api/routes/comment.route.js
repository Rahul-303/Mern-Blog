import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import {
  createComment,
  deleteComment,
  getComments,
  getPostComments,
  likeComment,
} from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createComment);
router.get('/getPostComments/:postId', getPostComments);
router.put('/likeComment/:commentId', verifyToken, likeComment);
router.get('/getComments',verifyToken, getComments);
router.delete('/deleteComment/:commentId',verifyToken, deleteComment);

export default router;