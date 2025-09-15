const validateSmsRequest = (req, res, next) => {
    const {
        customerName,
        phoneNumber,
        businessName,
        reviewLink,
        language
    } = req.body;

    const errors = [];

    // Required field validation
    if (!customerName || customerName.trim() === '') {
        errors.push('customerName is required');
    }

    if (!phoneNumber || phoneNumber.trim() === '') {
        errors.push('phoneNumber is required');
    }

    if (!businessName || businessName.trim() === '') {
        errors.push('businessName is required');
    }

    if (!reviewLink || reviewLink.trim() === '') {
        errors.push('reviewLink is required');
    }

    // Phone number format validation (basic)
    if (phoneNumber && !/^[+]?[\d\s\-()]+$/.test(phoneNumber)) {
        errors.push('phoneNumber format is invalid');
    }

    // URL validation for review link
    if (reviewLink && !isValidUrl(reviewLink)) {
        errors.push('reviewLink must be a valid URL');
    }

    // Language validation
    if (language && !['en', 'he', 'es', 'fr'].includes(language)) {
        errors.push('language must be one of: en, he, es, fr');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors
        });
    }

    next();
};

const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

module.exports = { validateSmsRequest };
