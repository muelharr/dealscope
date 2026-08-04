import { Router } from 'express';
import { AuthController } from './controller';
import { validate } from '../../middleware/validation.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { loginSchema, registerSchema, updateProfileSchema, changePasswordSchema } from './schemas';

const authRouter = Router();
const controller = new AuthController();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new User account
 *     description: Creates user credentials, opens a new session, and sets secure refresh cookie.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: P@ssword123
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Validation failed or duplicate email.
 */
authRouter.post('/register', validate(registerSchema), controller.register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Authenticate User
 *     description: Authenticates user credentials and issues short-lived JWT along with secure refresh cookie.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@dealscope.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Validation failed.
 *       401:
 *         description: Invalid email or password.
 */
authRouter.post('/login', validate(loginSchema), controller.login);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Rotate Authentication Session Tokens
 *     description: Consumes the secure HTTP-only refresh token and returns a fresh JWT access token.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Tokens successfully rotated.
 *       401:
 *         description: Refresh token invalid or expired.
 */
authRouter.post('/refresh', controller.refresh);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: Terminate Session
 *     description: Clears HTTP-only session refresh cookies.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Cookie deleted successfully.
 */
authRouter.post('/logout', controller.logout);

/**
 * @openapi
 * /api/v1/auth/me:
 *   get:
 *     summary: Fetch Profile
 *     description: Returns profile details for currently authenticated user session.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved.
 *       401:
 *         description: Unauthorized session.
 */
authRouter.get('/me', authenticate, controller.me);

/**
 * @openapi
 * /api/v1/auth/profile:
 *   put:
 *     summary: Update User Profile
 *     description: Updates the profile details (name, email) for the currently authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Validation failed or email already in use.
 *       401:
 *         description: Unauthorized session.
 */
authRouter.put('/profile', authenticate, validate(updateProfileSchema), controller.updateProfile);
authRouter.post('/upgrade', authenticate, controller.upgradePlan);

/**
 * @openapi
 * /api/v1/auth/change-password:
 *   put:
 *     summary: Change User Password
 *     description: Updates the password for the currently authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Validation failed or incorrect current password.
 *       401:
 *         description: Unauthorized session.
 */
authRouter.put('/change-password', authenticate, validate(changePasswordSchema), controller.changePassword);

export default authRouter;
export { authRouter };

