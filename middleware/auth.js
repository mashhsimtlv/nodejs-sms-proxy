const jwt = require('jsonwebtoken');

// Mock JWT verification for R&D
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Authorization token required'
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // For R&D purposes, we'll just decode without verification
        // In production, you should verify the JWT properly
        const decoded = jwt.decode(token);

        if (!decoded) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token format'
            });
        }

        // Add user info to request
        req.user = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role || 'authenticated'
        };

        console.log('Authenticated request from user:', req.user.email);
        next();

    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};

module.exports = authMiddleware;
